import express from 'express'
import path from 'path'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import passport from 'passport'
import DB_URL from './db.config.js'
import initializePassport from './passport.config.js'
import { sendEmail } from './nodemailer.config.js'
import __dirname from '../utils/utils.js'
import { createRandomProduct } from '../utils/utils.js'
import logger from '../utils/logger.js'
import productRouter from '../routes/productRouter.js'
import cartRouter from '../routes/cartRouter.js'
import sessionRouter from '../routes/sessionRouter.js'
import userRouter from '../routes/userRouter.js'
import viewsRouter from '../routes/viewsRouter.js'
import logerTestRouter from '../routes/loggerRouter.js'

// Configuración de Swagger para la documentación de la API
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


const serverConfig = () => {
    const app = express()

    // Swagger setup
    const swaggerSpecs = swaggerJSDoc(swaggerOptions)
    app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

    // Handlebars setup
    app.engine('handlebars', handlebars.engine())
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, "..", 'views'))

    // Middlewares
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
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
    // Passport setup
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())

    logger.info("Configurando las rutas...")

    // Static files
    app.use(express.static(path.join(__dirname, "..", 'public')))
    app.use(express.static(path.join(__dirname, 'uploads')))

    // Routes
    app.use('/api/products/', productRouter)
    app.use('/api/carts/', cartRouter)
    app.use('/api/session/', sessionRouter)
    app.use('/api/users/', userRouter)
    app.use(viewsRouter)
    app.use(logerTestRouter)

    // Test email route
    app.get('/mail', async (req, res) => {
        try {
            await sendEmail(process.env.MAIL_USERNAME, "Correo de prueba", "Este es un correo de prueba")
            res.send("Correo enviado")
        } catch (error) {
            logger.error(`No se ha podido enviar el correo, error: ${error}`)
            res.status(500).send("Error enviando correo")
        }
    })

    // Mock products route
    app.get('/mockingproducts', async (req, res) => {
        try {
            const products = Array.from({ length: 100 }, createRandomProduct)
            res.send(products)
        } catch (error) {
            logger.error(`No es posible crear los productos, error: ${error}`)
            res.status(500).send("Error creando productos")
        }
    })

    // Error handling middleware
    app.use((err, req, res, next) => {
        logger.error(`Unhandled error: ${err}`)
        res.status(500).send("Internal Server Error")
    })

    logger.info("Rutas configuradas...")
    return app
}

export default serverConfig