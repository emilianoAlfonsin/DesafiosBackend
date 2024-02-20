import express from "express"
import ProductManager from "./productManager.js"
import CartManager from "./cartManager.js"

const app = express()
const port = 8080
const productManager = new ProductManager('./data/products.json')
const cartManager = new CartManager('./data/carts.json')

app.listen(port, () => {
    console.log(`Server corriendo en el puerto ${port}`)
})

app.use(express.json())

app.use(express.urlencoded({encoded:true}))


// ----- Rutas para manejo de productos. ------

// Obtener todos los productos.
app.get('api/products/', async (req, res) => {
    const limit = req.query.limit
    const products = await productManager.getProducts()
    limit > 0
    ? res.json(products.slice(0, limit))
    : res.json(products)
})

// Obtener un producto por su Id. [Requerida]
app.get('api/products/:pid/', async (req, res) => {
    const product = await productManager.getProductById(req.params.pid)
    res.json(product)
})

// Agregar un nuevo producto. [Requerida]
app.post('api/products/', async (req, res) => {
    const product = req.body
    await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.offer)
    res.json(product)
})

// Actualizar producto. [Requerida]
app.put('api/products/:pid/', async (req, res) => {
    const product = req.body
    await productManager.updateProduct(req.params.pid, product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status)
    res.json(product)
})

// Eliminar un producto mediante su Id. [Requerida]
app.delete('api/products/:pid/', async (req, res) => {
    await productManager.deleteProductById(req.params.pid)
    res.json("Producto eliminado")
})

// ---- Rutas para manejo de carrito. -----

// Crear un nuevo carrito y agregar productos al carrito. [Requerida]
app.post('api/carts/', async (req, res) => {
    const cart = req.body
    await cartManager.addCart(cart.products)
    res.json(cart)
})

// Obtener todos los carritos.
app.get('api/carts/', async (req, res) => {
    const carts = await cartManager.getCarts()
    res.json(carts)
})

// Obtener un carrito por su id. [Requerida]
app.get('api/carts/:cid/', async (req, res) => {
    const cart = await cartManager.getCartById(req.params.cid)
    res.json(cart)
})

// Agregar un producto al carrito por su id. [Requerida]
app.post('api/carts/:cid/products/:pid', async (req, res) => {
    const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid)
    res.json(cart)
})

// Eliminar un carrito por su id.
app.delete('api/carts/:cid/', async (req, res) => {
    await cartManager.deleteCartById(req.params.cid)
    res.json("Carrito eliminado")    
})