import express from "express"
import cartRouter from "./managers/cartManager.js"
import productRouter from "./routes/productsRouter.js"

const app = express()
const port = 8080

app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`)
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))


// ----- Rutas para manejo de productos. ------
app.use('/api/products/', productRouter)

// ---- Rutas para manejo de carrito. -----
app.use('/api/carts/', cartRouter)