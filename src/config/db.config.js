import mongoose from "mongoose"
import { environment } from "./environment.config.js"
import logger from "../utils/logger.js"

const DB_URL = environment.mongo_url

// Configurar la conexión a MongoDB.
export async function conectMongoDB() {
    try {                       
        await mongoose.connect(DB_URL)
        logger.info("Conectado a MongoDB")
    } catch (error) {
        logger.info("No se pudo conectar a la DB",error)
        process.exit() // Detener la ejecución del servidor si no se puede conectar a la DB.
    }
}

export default DB_URL
