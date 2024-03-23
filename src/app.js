import express from "express"
import mongoose from "mongoose"
import path from "path"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import ProductsManagerDao from "./dao/services/productManager.js"
import productsModel from "./dao/models/productsModel.js"
import MessagesManagerDao from "./dao/services/messagesManager.js"


const app = express()
const PORT = process.env.PORT || 8080

// Configuración de Handlebars y vistas
app.set('views', path.join(__dirname+'/views'))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

// Midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Configuración de arcivos estáticos
app.use(express.static(path.join(__dirname+'/public')))

// Configurar la conexión a MongoDB.
const conectMongoDB = async() => {
    const DB_URL = 'mongodb+srv://emilianoa83:Coder2024@cluster0.3rp6pnj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
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
        //         }
        //     ]
        // )
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log("No se pudo conectar a la DB",error)
        process.exit() // Detener la ejecución del servidor si no se puede conectar a la DB.
    }
}

conectMongoDB()

// Configurar las rutas.
app.use('/api/products/', productRouter)
app.use('/api/carts/', cartRouter)
app.use(viewsRouter)

//Inicialización del server y socket.io
const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

const io = new Server(server)
const productManager = new ProductsManagerDao()
const messagesManager = new MessagesManagerDao()

// Manejo de eventos de socket.io
io.on('connection', socket => {
    console.log('Conectado')

    socket.on('initialProducts', async()=>{
        socket.emit('productList', await productManager.getProducts())
    })
    
    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product)
        console.log("Servidor/evento newProduuct:", product)
        
        io.emit('productList', await productManager.getProducts())
    })
    
    socket.on('deleteProduct', async (productId) => {
        await productManager.deleteProductById(productId)
        console.log("Servidor/evento deleteProduct:", productId)

        io.emit('productList', await productManager.getProducts())
    })

    socket.on('message', async (data) =>{
        console.log("Servidor/evento message:", data)
        await messagesManager.addMessage(data)
    })
})
