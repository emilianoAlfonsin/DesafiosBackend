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
import nodemailer from "nodemailer"
import { createRandomProduct } from '../utils/utils.js'
import logerTestRouter from '../routes/loggerRouter.js'

const serverConfig = () => {
    const app = express()

    // Configuración de Handlebars y vistas.
    app.engine('handlebars', handlebars.engine())
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, 'views'))

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


    //Nodemailer
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "stmp.gmail.com",
        secure: false,
        port: 587,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    })

    //Configuración de passport.
    initializePassport()
    app.use(passport.initialize())
    app.use(passport.session())


    console.log("Configurando las rutas...")
    // Configuración de rutas.
    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/api/products/', productRouter)
    app.use('/api/carts/', cartRouter)
    app.use('/api/session/', sessionRouter)
    app.use(viewsRouter)
    app.use(logerTestRouter)
    app.get('/mail', async (req, res) => {
        try{
            const result = await transporter.sendMail({
                from: `Correo de prueba <${process.env.MAIL_USERNAME}>`,
                to: `${process.env.MAIL_USERNAME}`,
                subject: "Prueba de correo",
                html: "<h1>Correo de prueba</h1>"
            })
            res.send('Correo enviado')
        } catch(error){
            console.log(error)
        }
    }) 
    app.get('/mockingproducts', async(req, res) => {
        try{
            let products = []
            for(let i = 0; i < 100; i++){
                products.push(createRandomProduct())
            }
            res.send(products)
        } catch(error){
            console.log(error)
        }
    })
    console.log("Rutas configuradas...")    

    return app
}

export default serverConfig