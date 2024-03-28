import mongoose from "mongoose"
// import { productsModel } from "../models/products.model.js"

const DB_URL = 'mongodb+srv://emilianoa83:Coder2024@cluster0.3rp6pnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Configurar la conexión a MongoDB.
const conectMongoDB = async() => {
    try {                       
        await mongoose.connect(DB_URL)
        // await productsModel.insertMany(
        //     [
        //         {
        //             title: "Producto 1",
        //             description: "Descripción del producto 1",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC1",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 2",
        //             description: "Descripción del producto 2",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC2",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 3",
        //             description: "Descripción del producto 3",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC3",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 4",
        //             description: "Descripción del producto 4",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC4",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 5",
        //             description: "Descripción del producto 5",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC5",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 6",
        //             description: "Descripción del producto 6",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC6",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 7",
        //             description: "Descripción del producto 7",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC7",
        //             stock: 10,
        //             status: true
        //         },
        //         {
        //             title: "Producto 8",
        //             description: "Descripción del producto 8",
        //             price: 100,
        //             thumbnail: "xxxxx.jpg",
        //             code: "ABC8",
        //             stock: 10,
        //             status: true
        //         }
        //     ]
        // )
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log("No se pudo conectar a la DB",error)
        process.exit() // Detener la ejecución del servidor si no se puede conectar a la DB.
    }
}

export default conectMongoDB