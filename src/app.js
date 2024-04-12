import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import {conectMongoDB} from "./config/db.config.js"
import initializeSocket from "./socket/socketManager.js"
import serverConfig from "./config/server.config.js"


const PORT = process.env.PORT || 8080

const app = serverConfig()


// Configurar las rutas.
app.use('/api/products/', productRouter)
app.use('/api/carts/', cartRouter)
app.use(viewsRouter)

//Inicialización del server y socket.io
const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

initializeSocket(server)

//Conección con el servidor de MongoDB.
conectMongoDB()

