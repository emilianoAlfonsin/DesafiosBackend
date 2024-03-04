import express from "express"
import path from "path"
import cartRouter from "./routes/cartRouter.js"
import productRouter from "./routes/productsRouter.js"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import viewsRouter from "./routes/viewsRouter.js"


const app = express()
const port = 8080


// Midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('views', path.join(__dirname+'/views'))

app.use(express.static(__dirname+'/public'))

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')



const server = app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`)
})
const io = new Server(server)

// io.on('connection', socket => {
//     socket.on('message', data => {
//         console.log(data)
//     })
    // socket.emit('message', 'Hola desde el servidor')
    // io.on('connection', socket => {
    //     console.log('Cliente conectado')
    // })
    
    // socket.on('newProduct', async (product) => {
    //     try {
    //         // Agregar el nuevo producto utilizando la clase ProductManager
    //         await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.stock, product.status)
    //         // Emitir un mensaje de confirmación al cliente si lo deseas
    //         socket.emit('productAdded', product)
    //     } catch (error) {
    //         console.error('Error al agregar el producto:', error)
    //         // Emitir un mensaje de error al cliente
    //         socket.emit('productError', { error: 'Error al agregar el producto' })
    //     }
    // })
// })

app.use('/api/products/', productRouter)

app.use('/api/carts/', cartRouter)

app.use(viewsRouter)