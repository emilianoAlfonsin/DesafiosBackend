import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'
import session from "express-session"
import MongoStore from "connect-mongo"
import DB_URL from './db.config.js'
import cartRouter from "../routes/cartRouter.js"
import productRouter from "../routes/productRouter.js"
import viewsRouter from "../routes/viewsRouter.js"
import sessionRouter from "../routes/sessionRouter.js"

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

    console.log("Configurando las rutas...")
    // Configuración de rutas.
    app.use(express.static(path.join(__dirname, 'public')))
    app.use('/api/products/', productRouter)
    app.use('/api/carts/', cartRouter)
    app.use('/api/session', sessionRouter)
    app.use(viewsRouter)
    console.log("Rutas configuradas...")    






    return app
}

export default serverConfig