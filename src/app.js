import express from "express"
import path from "path"
import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import viewsRouter from "./routes/viewsRouter.js"
import * as socket from 'socket.io'
import ProductManager from "./managers/productManager.js"



const app = express()
const PORT = 8080


// Midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('views', path.join(__dirname+'/views'))

app.use(express.static(path.join(__dirname+'/public')))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')


const server = app.listen(PORT, () => {
    console.log(`Server corriendo en el puerto ${PORT}`)
})
const io = new Server(server)
const manager = new ProductManager('./data/products.json')

io.on('connection', socket => {
    console.log('Conectado')
    
    socket.emit('productList', manager.getProducts())
    
    
    socket.on('newProduct', async(product) => {
        console.log(product)
        await manager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status)
        io.emit('productList', manager.getProducts())
    })

    // socket.on('deleteProduct', data => {
    //     manager.deleteProduct(data)
    //     io.emit('productList', manager.getProducts())
    // })

})

app.use('/api/products/', productRouter)

app.use('/api/carts/', cartRouter)

app.use(viewsRouter)