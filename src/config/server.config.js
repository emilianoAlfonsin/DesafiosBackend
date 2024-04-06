import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import __dirname from '../utils.js'

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

    return app
}

export default serverConfig