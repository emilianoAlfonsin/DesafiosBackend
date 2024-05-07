import {conectMongoDB} from "./config/db.config.js"
import initializeSocket from "./socket/socketManager.js"
import serverConfig from "./config/server.config.js"
import { environment } from "./config/environment.config.js"

const PORT = environment.port

const app = serverConfig()

//Inicialización del server y socket.io
const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

initializeSocket(server)

//Conección con el servidor de MongoDB.
conectMongoDB()

