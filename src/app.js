import express from "express"
import path, { dirname } from "path"
import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import viewsRouter from "./routes/viewsRouter.js"
import * as socket from 'socket.io'
import ProductManager from "./managers/productManager.js"
import mongoose from "mongoose"


const app = express()
const PORT = process.env.PORT || 8080


// Midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set('views', path.join(__dirname+'/views'))
app.use(express.static(path.join(__dirname+'/public')))
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')

// Configurar la conexión a MongoDB.
const conectMongoDB = async() => {
    const DB_URL = 'mongodb+srv://127.0.0.1:27017/ecommerce?retryWrites=true&w=majority'
    try {                       
        await mongoose.connect(DB_URL)
        console.log("Conectado a MongoDB")
    } catch (error) {
        console.log("No se pudo conectar a la DB",error)
        process.exit() // Detener la ejecución del servidor si no se puede conectar a la DB.
    }
}

conectMongoDB()

const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

const io = new Server(server)
const manager = new ProductManager("./data/products.json")
let getProducts = await manager.getProducts()

io.on('connection', socket => {
    console.log('Conectado')

    socket.on('initialProducts', async()=>{
        socket.emit('productList', await manager.getProducts())
    })
    
    socket.on('newProduct', async (product) => {
        await manager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status)
        console.log("Servidor/evento newProduuct:", product)
        
        io.emit('productList', await manager.getProducts())
    })
    
    socket.on('deleteProduct', async (productId) => {
        await manager.deleteProductById(productId)
        console.log("Servidor/evento deleteProduct:", productId)

        io.emit('productList', await manager.getProducts())
    })
})

app.use('/api/products/', productRouter)

app.use('/api/carts/', cartRouter)

app.use(viewsRouter)