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

io.on('connection', socket => {
    console.log('Conectado')
})

app.use('/api/products/', productRouter)

app.use('/api/carts/', cartRouter)

app.use(viewsRouter)