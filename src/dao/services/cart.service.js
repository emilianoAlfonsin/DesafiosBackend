import cartDAO from "../DAOs/cart.mongo.dao.js"
import CartDTO from "../DTOs/carts.dto.js"
import productsModel from "../models/productsModel.js"
import ticketModel from "../models/ticketModel.js"
import ticketDTO from "../DTOs/ticket.dto.js"
import userModel from "../models/userModel.js"
import { isValidObjectId } from "../../utils/utils.js"
import logger from "../../utils/logger.js"

export default class CartService {
    constructor() {
        this.products = productsModel
        this.tickets = ticketModel
        this.user = userModel
    }

    async getCarts() {
        const carts = await cartDAO.getAllCarts()
        return CartDTO.fromCartDocuments(carts)
    }

    async getCartById(id) {
        const cart = await cartDAO.getCartById(id)
        if (!cart) throw new Error("Carrito no encontrado")
        return CartDTO.fromCartDocument(cart)
    }

    async createCart(userId) {
        if (!isValidObjectId(userId)) throw new Error("ID de usuario no válido")

        const user = await this.user.findById(userId)
        if (!user) throw new Error("Usuario no encontrado")

        const newCart = await cartDAO.createCart(user._id)
        user.cart = newCart._id
        await user.save()

        return newCart
    }

    async addProductToCart(cid, pid) {
        const cart = await cartDAO.addProductToCart(cid, pid)
        return CartDTO.fromCartDocument(cart)
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await cartDAO.updateProductQuantity(cid, pid, quantity)
        return CartDTO.fromCartDocument(cart)
    }

    async updateCartProducts(cid, products) {
        const updatedCart = await cartDAO.updateCartProducts(cid, products)
        return updatedCart ? CartDTO.fromCartDocument(updatedCart) : null
    }

    async deleteCartById(id) {
        const deletedCart = await cartDAO.deleteCartById(id)
        return CartDTO.fromCartDocument(deletedCart)
    }

    async deleteProductFromCart(cid, pid) {
        const updatedCart = await cartDAO.deleteProductFromCart(cid, pid)
        return CartDTO.fromCartDocument(updatedCart)
    }

    async deleteAllProductsFromCart(cid) {
        const emptyCart = await cartDAO.deleteAllProductsFromCart(cid)
        return CartDTO.fromCartDocument(emptyCart)
    }

    async purchaseCart(cid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
    
        const cart = await cartDAO.getCartById(cid)
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
