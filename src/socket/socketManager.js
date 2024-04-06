import { Server } from "socket.io"
import ProductsManagerMongo from "../dao/services/productManager.js"
import MessagesManagerMongo from "../dao/services/messagesManager.js"

const initializeSocket = (server) => {

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
}

export default initializeSocket