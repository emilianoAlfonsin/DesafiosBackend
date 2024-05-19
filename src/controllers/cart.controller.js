import CartService from "../dao/services/cart.service.js"

const cartService = new CartService()

export default class CartController {
    constructor(){
    }

    // Obtener todos los carritos.
    async getCarts (req, res) {
        try {
            const carts = await cartService.getCarts()
            res.status(200).json({
                status: "success",
                payload: carts
            })
        } catch (error) {
            console.error("Error al obtener los carritos:", error.message)
            res.status(500).json({ 
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener los carritos"
            })
        }
    }

    // Obtener un carrito por su id.
    async getCartById (req, res) {
        try {
            const cart = await cartService.getCartById(req.params.cid)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al obtener el carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el carrito"
            }
            )
        }
    }

    //Crear un nuevo carrito.
    async createCart (req, res) {
        try {
            const newCart = await cartService.createCart()
            res.status(200).json({
                status: "success",
                payload: newCart
            })
        } catch (error) {
            console.error("Error al crear el carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al crear el carrito"
            })
        }
    }

    //Agregar un producto al carrito por su id.
    async addProductToCart (req, res) {
        try {
            const cart = await cartService.addProductToCart(req.params.cid, req.params.pid)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al agregar el producto al carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al agregar el producto al carrito"
            })
        }
    }

    //Actualizar un carrito con un array de productos.
    async updateCart (req, res) {
        try {
            const cart = await cartService.updateCart(req.params.cid, req.body)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al actualizar el carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al actualizar el carrito"
            })
        }
    }

    //Actualizar la cantidad de un producto en un carrito.
    async updateProductQuantity (req, res) {
        try {
            const cart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al actualizar la cantidad del producto:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al actualizar la cantidad del producto"
            })
        }
    }

    //Eliminar un producto del carrito por su id.
    async deleteProductFromCart (req, res) {
        try {
            const cart = await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al eliminar el producto del carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al eliminar el producto del carrito"
            })
        }
    }

    //Eliminar todos los productos del carrito.
    async deleteAllProductsFromCart (req, res) {
        try {
            const cart = await cartService.deleteAllProductsFromCart(req.params.cid)
            res.status(200).json({
                status: "success",
                payload: cart
            })
        } catch (error) {
            console.error("Error al eliminar todos los productos del carrito:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al eliminar todos los productos del carrito"
            })
        }
    }
}