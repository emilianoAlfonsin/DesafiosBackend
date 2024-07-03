import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import __dirname from '../utils/utils.js'
import session from "express-session"
import MongoStore from "connect-mongo"
import DB_URL from './db.config.js'
import cartRouter from "../routes/cartRouter.js"
import productRouter from "../routes/productRouter.js"
import viewsRouter from "../routes/viewsRouter.js"
import sessionRouter from "../routes/sessionRouter.js"
import passport from "passport"
import initializePassport from "./passport.config.js"
import { createRandomProduct } from '../utils/utils.js'
import logerTestRouter from '../routes/loggerRouter.js'
import { sendEmail } from './nodemailer.config.js'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import logger from '../utils/logger.js'

const serverConfig = () => {
    const app = express()

    const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'Documentación de la API',
                version: '1.0.0',
                description: 'Documentación de la API de e-commerce'
            }
        },
        apis: [`${__dirname}/../docs/**/*.yaml`]
    }

    const swaggerSpecs = swaggerJSDoc(swaggerOptions)

    // Ruta de documentación de la API
    app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))
    // Configuración de Handlebars y vistas.
    app.engine('handlebars', handlebars.engine())
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "..",'views'))

    // Midlewares
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(session({
        store: MongoStore.create({
            mongoUrl: DB_URL,
            ttl: 3600
            }),
        secret: 'secret',
        resave: false,
        saveUninitialized: false
        })
    )

    //Configuración de passport.
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())


    logger.info("Configurando las rutas...")
    // Configuración de rutas.
    app.use(express.static(path.join(__dirname,"..",'public')))
    app.use('/api/products/', productRouter)
    app.use('/api/carts/', cartRouter)
    app.use('/api/session/', sessionRouter)
    app.use(viewsRouter)
    // Testeo de respuesta de logger
    app.use(logerTestRouter)
    // Envío de correo de prueba
    app.get('/mail', async(req, res) => {
        try{
            await sendEmail(process.env.MAIL_USERNAME, "Correo de prueba", "Este es un correo de prueba")
            res.send("Correo enviado")
        } catch(error){
            logger.error(`No se ha podido enviar el correo, error: ${error}`)
        }
    }) 
    // Mocking de productos
    app.get('/mockingproducts', async(req, res) => {
        try{
            let products = []
            for(let i = 0; i < 100; i++){
                products.push(createRandomProduct())
            }
            res.send(products)
        } catch(error){
            logger.error(`No es posible crear los productos, error: ${error}`)
        }
    })
    logger.info("Rutas configuradas...")    
    return app
}

export default serverConfig