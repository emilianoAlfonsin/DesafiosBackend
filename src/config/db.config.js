import mongoose from "mongoose"
import { environment } from "./environment.config"

const DB_URL = environment.mongo_url

// Configurar la conexión a MongoDB.
export async function conectMongoDB() {
    try {                       
        await mongoose.connect(DB_URL)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log("No se pudo conectar a la DB",error)
        process.exit() // Detener la ejecución del servidor si no se puede conectar a la DB.
    }
}

export default DB_URL
