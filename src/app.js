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
const manager = new ProductsManagerDao()

// Manejo de eventos de socket.io
io.on('connection', socket => {
    console.log('Conectado')

    socket.on('initialProducts', async()=>{
        socket.emit('productList', await manager.getProducts())
    })
    
    socket.on('newProduct', async (product) => {
        await manager.addProduct(product)
        console.log("Servidor/evento newProduuct:", product)
        
        io.emit('productList', await manager.getProducts())
    })
    
    socket.on('deleteProduct', async (productId) => {
        await manager.deleteProductById(productId)
        console.log("Servidor/evento deleteProduct:", productId)

        io.emit('productList', await manager.getProducts())
    })
})
