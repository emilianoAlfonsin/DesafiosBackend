import CartService from "../services/cart.service.js"
import ProductService from "../services/product.service.js"
import logger from "../utils/logger.js"

const cartService = new CartService()
const productService = new ProductService()

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
            logger.error("Error al obtener los carritos")
            res.status(500).json({ 
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener los carritos",
                message: error.message
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
            logger.error("Error al obtener el carrito")
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el carrito",
                message: error.message
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
                description: "Error al crear el carrito",
                message: error.message
            })
        }
    }

    //Agregar un producto al carrito por su id.
    async addProductToCart (req, res) {
        try {
            // Verificar si el usuario es el propietario del producto
            const product = await productService.getProductById(req.params.pid)
            if (!product) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }

            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                return res.status(403).json({
                    status: "failure",
                    errorCode: "FORBIDDEN",
                    description: "No tienes permiso para agregar este producto al carrito"
                })
            }

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
                description: "Error al agregar el producto al carrito",
                message: error.message
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
                description: "Error al actualizar el carrito",
                message: error.message
            })
        }
    }

    //Actualizar la cantidad de un producto en un carrito.
    async updateProductQuantity (req, res) {
        try {
            // Verificar si el usuario es propietario del producto
            const product = await productService.getProductById(req.params.pid)
            if (!product) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }
            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                return res.status(403).json({
                    status: "failure",
                    errorCode: "FORBIDDEN",
                    description: "No tienes permiso para actualizar la cantidad de este producto"
                })
            } 

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
                description: "Error al actualizar la cantidad del producto",
                message: error.message
            })
        }
    }

    //Eliminar un producto del carrito por su id.
    async deleteProductFromCart (req, res) {
        try {
            // Verificar si el usuario es propietario del producto
            const product = await productService.getProductById(req.params.pid)
            if (!product) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }
            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                return res.status(403).json({
                    status: "failure",
                    errorCode: "FORBIDDEN",
                    description: "No tienes permiso para eliminar este producto del carrito"
                })
            }

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
                description: "Error al eliminar el producto del carrito",
                message: error.message
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
                description: "Error al eliminar todos los productos del carrito",
                message: error.message
            })
        }
    }

    async purchaseCart(req, res) {
        try {
            const cartId = req.params.cid
            const ticket = await cartService.purchaseCart(cartId)
            res.status(200).json({
                status: "success",
                payload: ticket
            })
        } catch (error) {
            res.status(500).json({ 
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al finalizar el proceso de compra del carrito",
                error: error.message
            })
        }
    }    

}