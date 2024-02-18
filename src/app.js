import express from "express"
import ProductManager from "./productManager.js"


const app = express()
const port = 8080
const productManager = new ProductManager('./products.json')

app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`)
})

app.use(express.json())

app.use(express.urlencoded({encoded:true}))



app.get('api/products', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts()
    limit > 0
    ? res.json(products.slice(0, limit))
    : res.json(products)
})


app.get('api/products/:pid', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid)
    res.json(product)
})

app.post('api/products', async (req, res) => {
    const product = req.body
    await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.offer)
    res.json(product)
})

app.put('api/products/:pid', async (req, res) => {
    const product = req.body
    await productManager.updateProduct(req.params.pid, product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.offer)
    res.json(product)
})

app.delete('api/products/:pid', async (req, res) => {
    await productManager.deleteProductById(req.params.pid)
    res.json("Producto eliminado")
})