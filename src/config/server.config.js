import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'
import session from "express-session"
import MongoStore from "connect-mongo"
import DB_URL from './db.config.js'

const serverConfig = () => {
    const app = express()

    // Configuración de Handlebars y vistas.
    app.engine('handlebars', handlebars.engine())
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, 'views'))

    // Midlewares
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))

    // Configuración de rutas.
    app.use(express.static(path.join(__dirname, 'public')))

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




    return app
}

export default serverConfig