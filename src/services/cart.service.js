import CartRepository from "../dao/repositories/cart.repository.js"
import CartDTO from "../dao/DTOs/carts.dto.js"
import productsModel from "../dao/models/productsModel.js"
import ticketModel from "../dao/models/ticketModel.js"
import ticketDTO from "../dao/DTOs/ticket.dto.js"
import userModel from "../dao/models/userModel.js"
import { isValidObjectId } from "../utils/utils.js"
import logger from "../utils/logger.js"

export default class CartService {
    constructor() {
        this.products = productsModel
        this.tickets = ticketModel
        this.user = userModel
    }

    // Obtener todos los carritos
    async getCarts() {
        logger.info("Obteniendo todos los carritos")
        const carts = await CartRepository.getAllCarts()
        return CartDTO.fromCartDocuments(carts)
    }

    // Obtener carrito por ID
    async getCartById(id) {
        logger.info(`Obteniendo carrito con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("ID de carrito no válido")
            throw new Error("ID de carrito no válido")
        }
        
        const cart = await CartRepository.getCartById(id)
        if (!cart) {
            logger.error("Carrito no encontrado")
            throw new Error("Carrito no encontrado")
        }
        return CartDTO.fromCartDocument(cart)
    }

    // Crear un nuevo carrito para un usuario
    async createCart(userId) {
        logger.info(`Creando carrito para el usuario con ID: ${userId}`)
        if (!isValidObjectId(userId)) {
            logger.error("ID de usuario no válido")
            throw new Error("ID de usuario no válido")
        }

        const user = await this.user.findById(userId)
        if (!user) {
            logger.error("Usuario no encontrado")
            throw new Error("Usuario no encontrado")
        }
        if (user.cart) {
            logger.error("El usuario ya tiene un carrito asignado")
            throw new Error("El usuario ya tiene un carrito asignado")
        }

        const newCart = await CartRepository.createCart(user._id)
        user.cart = newCart._id
        await user.save()

        logger.info(`Carrito creado con ID: ${newCart._id}`)
        return newCart
    }

    // Agregar un producto al carrito
    async addProductToCart(cid, pid, quantity = 1) {
        logger.info(`Agregando producto con ID: ${pid} al carrito con ID: ${cid}`)
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            logger.error("ID de carrito o producto no válido")
            throw new Error("ID de carrito o producto no válido")
        }
        
        const cart = await CartRepository.getCartById(cid)
        if (!cart) {
            logger.error("Carrito no encontrado")
            throw new Error("Carrito no encontrado")
        }

        const product = await this.products.findById(pid)
        if (!product) {
            logger.error("Producto no encontrado")
            throw new Error("Producto no encontrado")
        }

        const existingProductIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }

        await CartRepository.addProductToCart(cart)
        logger.info(`Producto con ID: ${pid} agregado al carrito con ID: ${cid}`)
        return CartDTO.fromCartDocument(cart)
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cid, pid, quantity) {
        logger.info(`Actualizando cantidad del producto con ID: ${pid} en el carrito con ID: ${cid}`)
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            logger.error("ID de carrito o producto no válido")
            throw new Error("ID de carrito o producto no válido")
        }
        if (quantity < 1) {
            logger.error("La cantidad debe ser mayor o igual a 1")
            throw new Error("La cantidad debe ser mayor o igual a 1")
        }

        const cart = await CartRepository.getCartById(cid)
        if (!cart) {
            logger.error("Carrito no encontrado")
            throw new Error("Carrito no encontrado")
        }

        const productIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (productIndex === -1) {
            logger.error("Producto no encontrado en el carrito")
            throw new Error("Producto no encontrado en el carrito")
        }

        cart.products[productIndex].quantity = quantity
        await CartRepository.updateProductQuantity(cart)
        logger.info(`Cantidad del producto con ID: ${pid} actualizada en el carrito con ID: ${cid}`)
        return CartDTO.fromCartDocument(cart)
    }

    // Actualizar los productos del carrito
    async updateCartProducts(cid, products) {
        logger.info(`Actualizando productos del carrito con ID: ${cid}`)
        if (!isValidObjectId(cid)) {
            logger.error("ID de carrito no válido")
            throw new Error("ID de carrito no válido")
        }
        
        for (const product of products) {
            if (!isValidObjectId(product.product)) {
                logger.error("ID de producto no válido")
                throw new Error("ID de producto no válido")
            }
            if (product.quantity < 1) {
                logger.error("La cantidad debe ser mayor o igual a 1")
                throw new Error("La cantidad debe ser mayor o igual a 1")
            }
        }

        const updatedCart = await CartRepository.updateCartProducts(cid, products)
        logger.info(`Productos del carrito con ID: ${cid} actualizados`)
        return updatedCart ? CartDTO.fromCartDocument(updatedCart) : null
    }

    // Eliminar un carrito por ID
    async deleteCartById(id) {
        logger.info(`Eliminando carrito con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("ID de carrito no válido")
            throw new Error("ID de carrito no válido")
        }
        
        const deletedCart = await CartRepository.deleteCartById(id)
        logger.info(`Carrito con ID: ${id} eliminado`)
        return CartDTO.fromCartDocument(deletedCart)
    }

    // Eliminar un producto del carrito
    async deleteProductFromCart(cid, pid) {
        logger.info(`Eliminando producto con ID: ${pid} del carrito con ID: ${cid}`)
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
            logger.error("ID de carrito o producto no válido")
            throw new Error("ID de carrito o producto no válido")
        }
        
        const updatedCart = await CartRepository.deleteProductFromCart(cid, pid)
        logger.info(`Producto con ID: ${pid} eliminado del carrito con ID: ${cid}`)
        return CartDTO.fromCartDocument(updatedCart)
    }

    // Eliminar todos los productos del carrito
    async deleteAllProductsFromCart(cid) {
        logger.info(`Eliminando todos los productos del carrito con ID: ${cid}`)
        if (!isValidObjectId(cid)) {
            logger.error("ID de carrito no válido")
            throw new Error("ID de carrito no válido")
        }
        
        const emptyCart = await CartRepository.deleteAllProductsFromCart(cid)
        logger.info(`Todos los productos del carrito con ID: ${cid} eliminados`)
        return CartDTO.fromCartDocument(emptyCart)
    }

    // Realizar la compra del carrito
    async purchaseCart(cid) {
        logger.info(`Realizando compra del carrito con ID: ${cid}`)
        if (!isValidObjectId(cid)) {
            logger.error("El ID del carrito no es válido")
            throw new Error("El ID del carrito no es válido")
        }

        const cart = await CartRepository.getCartById(cid)
        if (!cart) {
            logger.error("Carrito no encontrado")
            throw new Error("Carrito no encontrado")
        }
        if (cart.products.length === 0) {
            logger.error("El carrito está vacío")
            throw new Error("El carrito está vacío")
        }

        const purchaseList = []
        const productsNotPurchased = []

        for (const item of cart.products) {
            const product = await this.products.findById(item.product)
            if (!product) {
                logger.error(`Producto con ID ${item.product} no encontrado`)
                productsNotPurchased.push(item)
                continue
            }

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity
                await product.save()
                purchaseList.push({ product, quantity: item.quantity })
            } else {
                logger.info(`Stock insuficiente para el producto con ID ${item.product}`)
                productsNotPurchased.push(item)
            }
        }

        const amount = purchaseList.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

        if (amount === 0) {
            logger.error("No se pudieron comprar los productos debido a falta de stock")
            throw new Error("No se pudieron comprar los productos debido a falta de stock")
        }

        const newTicket = await this.tickets.create({
            code: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
            purchase_datetime: new Date(),
            amount: amount,
            purchaser: cart.owner
        })

        cart.products = productsNotPurchased
        await cart.save()

        logger.info(`Compra realizada con éxito. Ticket ID: ${newTicket._id}`)
        return ticketDTO.toDTO(newTicket)
    }
}

