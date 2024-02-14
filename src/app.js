import express from "express"
import ProductManager from "./productManager.js"


const app = express()
const port = 8080
const productManager = new ProductManager()

app.use(express.urlencoded({encoded:true}))


app.get('/products', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts()
    limit > 0
    ? res.json(products.slice(0, limit))
    : res.json(products)
})


app.get('/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid)
    res.json(product)
})

app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`)
})