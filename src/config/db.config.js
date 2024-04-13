import mongoose from "mongoose"


const DB_URL = 'mongodb+srv://emilianoa83:Coder2024@cluster0.3rp6pnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

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
