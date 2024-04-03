import { Router } from "express"
import CartsManagerMongo from "../dao/services/cartManager.js"

const cartRouter = Router()
const cartManager = new CartsManagerMongo()

// Obtener todos los carritos.
cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json(carts)
    } catch (error) {
        console.error("Error al obtener los carritos:", error.message)
        res.status(500).json({ error: "Error al obtener los carritos" })
    }
});

// Obtener un carrito por su id. 
cartRouter.get('/:cid/', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid)
        console.log(cart);
        if (!cart) return res.status(404).json({ error: "El carrito no se encontró" })
        res.status(200).render('cart', { cart: cart })
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message)
        res.status(500).json({ error: "Error al obtener el carrito" })
    }
})

// Crear un nuevo carrito. 
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(200).json(newCart)
    } catch (error) {
        console.error("Error al agregar el carrito:", error.message)
        res.status(500).json({ error: "Error al agregar el carrito" })
    }
})
// Agregar un producto al carrito por su id. 
cartRouter.post('/:cid/products/:pid/', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message)
        res.status(500).json({ error: "Error al agregar el producto al carrito" })
    }
})

//Actualizar un carrito con un array de productos.
cartRouter.put('/:cid/', async (req, res) => {
    try {
        // const cartId = req.params.cid
        // console.log(cartId)
        // const products = req.body // Array de productos a agregar al carrito.
        // console.log(products)
        const cart = await cartManager.updateCartProducts(req.params.cid, req.body)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al actualizar el carrito:", error.message)
        res.status(500).json({ error: "Error al actualizar el carrito" })
    }
})

//Actualizar solo la cantidad del producto.
cartRouter.put('/:cid/products/:pid/', async (req, res) => {
    try {
        const cart = await cartManager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al actualizar la cantidad del producto:", error.message)
        res.status(500).json({ error: "Error al actualizar la cantidad del producto" })
    }
})

// Eliminar un carrito por su id.
cartRouter.delete('/:cid/', async (req, res) => {
    try {
        await cartManager.deleteCartById(req.params.cid);
        res.status(200).json({ message: "Carrito eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar el carrito:", error.message);
        res.status(500).json({ error: "Error al eliminar el carrito" });
    }

// eliminar un producto del carrito por su id.
cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid);
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error.message);
        res.status(500).json({ error: "Error al eliminar el producto del carrito" });
    }
})
})

//Eliminar un producto del carrito por su id.
cartRouter.delete('/:cid/products/:pid/', async (req, res) => {
    try {
        const cart = await cartManager.deleteProductFromCart(req.params.cid, req.params.pid)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error.message)
        res.status(500).json({ error: "Error al eliminar el producto del carrito" })
    }
})

//Eliminar todos los productos del carrito.
cartRouter.delete('/:cid/products/', async (req, res) => {
    try {
        const cart = await cartManager.deleteAllProductsFromCart(req.params.cid)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al eliminar todos los productos del carrito:", error.message)
        res.status(500).json({ error: "Error al eliminar todos los productos del carrito" })
    }
})


export default cartRouter