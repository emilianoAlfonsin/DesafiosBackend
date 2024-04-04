import express from "express"
import path from "path"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import viewsRouter from "./routes/viewsRouter.js"
import ProductsManagerMongo from "./dao/services/productManager.js"
import MessagesManagerMongo from "./dao/services/messagesManager.js"
import conectMongoDB from "./config/db.config.js"


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
app.use('/assets', express.static(path.join(__dirname, 'public', 'assets')))


// Configurar las rutas.
app.use('/api/products/', productRouter)
app.use('/api/carts/', cartRouter)
app.use(viewsRouter)

//Inicialización del server y socket.io
const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})

//Conección con el servidor de MongoDB.
conectMongoDB()

const io = new Server(server)
//Instanciar los managers
const productManager = new ProductsManagerMongo()
const messagesManager = new MessagesManagerMongo()

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

    socket.on('messageLogs', async (data) =>{
        console.log("Servidor/evento message:", data)
        await messagesManager.addMessage(data)
        io.emit('messageLogs', await messagesManager.getAllMessages())
    })
})
