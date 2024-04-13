import {conectMongoDB} from "./config/db.config.js"
import initializeSocket from "./socket/socketManager.js"
import serverConfig from "./config/server.config.js"

const PORT = process.env.PORT || 8080

const app = serverConfig()

//Inicialización del server y socket.io
const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

initializeSocket(server)

//Conección con el servidor de MongoDB.
conectMongoDB()

