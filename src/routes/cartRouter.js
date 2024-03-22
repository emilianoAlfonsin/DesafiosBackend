import { Router } from "express"
import CartsManagerMongo from "../dao/services/cartManager.js"

const cartRouter = Router()
const cartManager = new CartsManagerMongo()

// Crear un nuevo carrito. [Requerida]
cartRouter.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.createCart()
        res.status(200).json(newCart)
    } catch (error) {
        console.error("Error al agregar el carrito:", error.message)
        res.status(500).json({ error: "Error al agregar el carrito" })
    }
})

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

// Obtener un carrito por su id. [Requerida]
cartRouter.get('/:cid/', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid)
        if (!cart) return res.status(404).json({ error: "El carrito no se encontró" })
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message)
        res.status(500).json({ error: "Error al obtener el carrito" })
    }
})

// Agregar un producto al carrito por su id. [Requerida]
cartRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.addProductToCart(req.params.cid, req.params.pid)
        res.status(200).json(cart)
    } catch (error) {
        console.error("Error al agregar el producto al carrito:", error.message)
        res.status(500).json({ error: "Error al agregar el producto al carrito" })
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
})

export default cartRouter