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

    async getCarts() {
        const carts = await CartRepository.getAllCarts()
        return CartDTO.fromCartDocuments(carts)
    }

    async getCartById(id) {
        if (!isValidObjectId(id)) throw new Error("ID de carrito no válido")
        
        const cart = await CartRepository.getCartById(id)
        if (!cart) throw new Error("Carrito no encontrado")
        return CartDTO.fromCartDocument(cart)
    }

    async createCart(userId) {
        if (!isValidObjectId(userId)) throw new Error("ID de usuario no válido")

        const user = await this.user.findById(userId)
        if (!user) throw new Error("Usuario no encontrado")
        if (user.cart) throw new Error("El usuario ya tiene un carrito asignado")

        const newCart = await CartRepository.createCart(user._id)
        user.cart = newCart._id
        await user.save()

        return newCart
    }

    async addProductToCart(cid, pid, quantity = 1) {
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) throw new Error("ID de carrito o producto no válido")
        
        const cart = await CartRepository.getCartById(cid)
        if (!cart) throw new Error("Carrito no encontrado")

        const product = await this.products.findById(pid)
        if (!product) throw new Error("Producto no encontrado")

        const existingProductIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }

        await CartRepository.addProductToCart(cart)
        return CartDTO.fromCartDocument(cart)
    }

    async updateProductQuantity(cid, pid, quantity) {
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) throw new Error("ID de carrito o producto no válido")
        if (quantity < 1) throw new Error("La cantidad debe ser mayor o igual a 1")

        const cart = await CartRepository.getCartById(cid)
        if (!cart) throw new Error("Carrito no encontrado")

        const productIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito")
        }

        cart.products[productIndex].quantity = quantity
        await CartRepository.updateProductQuantity(cart)
        return CartDTO.fromCartDocument(cart)
    }

    async updateCartProducts(cid, products) {
        if (!isValidObjectId(cid)) throw new Error("ID de carrito no válido")
        
        for (const product of products) {
            if (!isValidObjectId(product.product)) throw new Error("ID de producto no válido")
            if (product.quantity < 1) throw new Error("La cantidad debe ser mayor o igual a 1")
        }

        const updatedCart = await CartRepository.updateCartProducts(cid, products)
        return updatedCart ? CartDTO.fromCartDocument(updatedCart) : null
    }

    async deleteCartById(id) {
        if (!isValidObjectId(id)) throw new Error("ID de carrito no válido")
        
        const deletedCart = await CartRepository.deleteCartById(id)
        return CartDTO.fromCartDocument(deletedCart)
    }

    async deleteProductFromCart(cid, pid) {
        if (!isValidObjectId(cid) || !isValidObjectId(pid)) throw new Error("ID de carrito o producto no válido")
        
        const updatedCart = await CartRepository.deleteProductFromCart(cid, pid)
        return CartDTO.fromCartDocument(updatedCart)
    }

    async deleteAllProductsFromCart(cid) {
        if (!isValidObjectId(cid)) throw new Error("ID de carrito no válido")
        
        const emptyCart = await CartRepository.deleteAllProductsFromCart(cid)
        return CartDTO.fromCartDocument(emptyCart)
    }

    async purchaseCart(cid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")

        const cart = await CartRepository.getCartById(cid)
        if (!cart) throw new Error("Carrito no encontrado")
        if (cart.products.length === 0) throw new Error("El carrito está vacío")

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

        if (amount === 0) throw new Error("No se pudieron comprar los productos debido a falta de stock")

        const newTicket = await this.tickets.create({
            code: Math.floor(Math.random() * (999999 - 100000 + 1) + 100000),
            purchase_datetime: new Date(),
            amount: amount,
            purchaser: cart.owner
        })

        cart.products = productsNotPurchased
        await cart.save()

        return ticketDTO.toDTO(newTicket)
    }
}

