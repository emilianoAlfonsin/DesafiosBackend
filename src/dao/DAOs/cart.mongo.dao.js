import cartsModel from "../models/cartsModel.js"
import { isValidObjectId } from "../../utils/utils.js"

class CartDAO {

    // Obtener todos los carritos
    async getAllCarts() {
        return await cartsModel.find()
    }

    // Obtener un carrito por su ID
    async getCartById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del carrito no es válido")
        return await cartsModel.findById(id).populate("products.product")
    }

    // Crear un carrito
    async createCart(userId) {
        if (!isValidObjectId(userId)) throw new Error("ID de usuario no válido")
        return await cartsModel.create({ owner: userId })
    }

    // Agregar un producto al carrito
    async addProductToCart(cid, pid, quantity = 1) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")

        // Verificar si el producto ya existe en el carrito
        const cart = await cartsModel.findById(cid)
        if (!cart) throw new Error("Carrito no encontrado")

        // Verificar si el producto ya existe en el carrito
        const existingProductIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity
        } else {
            cart.products.push({ product: pid, quantity })
        }

        await cart.save()
        return cart
    }

    async updateProductQuantity(cid, pid, quantity) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")

        const cart = await cartsModel.findById(cid)
        if (!cart) throw new Error("Carrito no encontrado")

        const productIndex = cart.products.findIndex(product => product.product.equals(pid))
        if (productIndex === -1) {
            throw new Error("Producto no encontrado en el carrito")
        }

        cart.products[productIndex].quantity = quantity
        await cart.save()
        return cart
    }

    async updateCartProducts(cid, products) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (products.length === 0) throw new Error("La lista de productos no puede estar vacía")

        products.forEach(product => {
            if (!isValidObjectId(product.product)) throw new Error("El ID del producto no es válido")
            if (typeof product.quantity !== "number" || product.quantity < 1) throw new Error("La cantidad debe ser un número mayor a 0")
        })

        return await cartsModel.findByIdAndUpdate(cid, { $set: { products } }, { new: true })
    }

    async deleteCartById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del carrito no es válido")
        return await cartsModel.findByIdAndDelete(id)
    }

    async deleteProductFromCart(cid, pid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")

        return await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } })
    }

    async deleteAllProductsFromCart(cid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        return await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true })
    }
}

export default new CartDAO()
