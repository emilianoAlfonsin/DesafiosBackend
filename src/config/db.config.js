import mongoose from "mongoose"
import productsModel from "../dao/models/productsModel.js"

const DB_URL = 'mongodb+srv://emilianoa83:Coder2024@cluster0.3rp6pnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// Configurar la conexión a MongoDB.
const conectMongoDB = async() => {
    try {                       
        await mongoose.connect(DB_URL)
        // await productsModel.insertMany(
        //     [
        //         {
        //             title: "Producto 17",
        //             description: "Descripción del producto 17",
        //             price: 20,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC17",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 18",
        //             description: "Descripción del producto 18",
        //             price: 40,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC18",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 19",
        //             description: "Descripción del producto 19",
        //             price: 35,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC19",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 20",
        //             description: "Descripción del producto 20",
        //             price: 80,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC20",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 21",
        //             description: "Descripción del producto 21",
        //             price: 60,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC21",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 22",
        //             description: "Descripción del producto 22",
        //             price: 15,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC22",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 23",
        //             description: "Descripción del producto 23",
        //             price: 25,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC23",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 24",
        //             description: "Descripción del producto 24",
        //             price: 100,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC24",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 25",
        //             description: "Descripción del producto 25",
        //             price: 120,
        //             thumbnail: "pantalones.jpg",
        //             code: "ABC25",
        //             stock: 10,
        //             status: false,
        //             category: "pantalones"
        //         },
        //         {
        //             title: "Producto 26",
        //             description: "Descripción del producto 26",
        //             price: 70,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC26",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 27",
        //             description: "Descripción del producto 27",
        //             price: 35,
        //             thumbnail: "zapatillas.jpg",
        //             code: "ABC27",
        //             stock: 10,
        //             status: false,
        //             category: "zapatillas"
        //         },
        //         {
        //             title: "Producto 28",
        //             description: "Descripción del producto 28",
        //             price: 110,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC28",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 29",
        //             description: "Descripción del producto 29",
        //             price: 200,
        //             thumbnail: "zapatillas.jpg",
        //             code: "ABC29",
        //             stock: 10,
        //             status: false,
        //             category: "zapatillas"
        //         },
        //         {
        //             title: "Producto 30",
        //             description: "Descripción del producto 30",
        //             price: 110,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC30",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 31",
        //             description: "Descripción del producto 31",
        //             price: 55,
        //             thumbnail: "remeras.jpg",
        //             code: "ABC31",
        //             stock: 10,
        //             status: false,
        //             category: "remeras"
        //         },
        //         {
        //             title: "Producto 32",
        //             description: "Descripción del producto 32",
        //             price: 160,
        //             thumbnail: "zapatillas.jpg",
        //             code: "ABC32",
        //             stock: 10,
        //             status: false,
        //             category: "zapatillas"
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