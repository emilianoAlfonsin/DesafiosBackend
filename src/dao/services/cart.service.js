import cartsModel from "../models/cartsModel.js"
import CartDTO from "../DTOs/carts.dto.js"

// Metodo de validación de id existente en la DB.
import { isValidObjectId } from "../../utils.js"

export default class CartService {
    constructor() {
        this.carts = cartsModel
    }

    // Devolver todos los carritos.
    async getCarts() {
        const carts = await this.carts.find()
        console.log(JSON.stringify(carts, null, "\t"))
        return CartDTO.fromCartDocuments(carts)
    }

    // Devolver un carrito por su id.
    async getCartById(id) {
        const cart = await this.carts.findById(id).populate("products.product")
        if (!cart) throw new Error("Carrito no encontrado")
        // const populatedCart = cart.toObject() // Convierte un documento de mongoose a un objeto plano para manipularlo con Js.
        // console.log(JSON.stringify(populatedCart, null, "\t"))
        return CartDTO.fromCartDocument(cart)
    }

    // Crear un carrito. 
    async createCart() {
        const newCart = await this.carts.create({})
        return newCart._id.toString()// Retorna el id del carrito creado convertido a string
    }

    // Agregar un producto al carrito.
    async addProductToCart(cid, pid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
        
        //Buscar el carrito, si no existe, crearlo.
        // let cart = await this.carts.findById(cid)
        // if (!cart) {
        //     cart = await this.carts.create({ _id: cid, products: [] })
        // }

        // Buscar el carrito, si no lo encuentra lanza error.
        const cart = await this.carts.findById(cid)
        if (!cart) throw new Error("Carrito no encontrado")
        
        //Buscar el producto, si lo encuentra le suma uno a la cantidad. Si no lo encuentra le asigna quantity = 1
        const existingProductIndex = cart.products.findIndex(product => product._id.equals(pid))
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++
        } else {
            cart.products.push({_id: pid, quantity: 1, product: pid})
        }

        await cart.save()

        return CartDTO.fromCartDocument(cart)
    }

    // Actualizar solo la cantidad del producto.
    async updateProductQuantity(cid, pid, quantity) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
        console.log("cid:", cid, " pid:" , pid , " quantity:" , quantity)
        
        const cart = await this.carts.findById(cid)
        if (!cart) throw new Error("Carrito no encontrado")

        const productIndex = cart.products.findIndex( product => product.product.equals(pid))
        productIndex === -1 
            ? cart = await this.carts.findByIdAndUpdate(
                cid, 
                {$push: {products: {_id: pid, quantity: quantity, product: pid}}}, 
                {new: true}
                )
            : cart.products[productIndex].quantity = quantity

        await cart.save()
        
        return CartDTO.fromCartDocument(cart) 
    }

    //Actualizar la lista de productos del carrito con un array de productos.
    async updateCartProducts(cid, products) {
        // console.log(products)
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if(products.length === 0) throw new Error("La lista de productos no puede estar vacía")

        products.forEach(product => {
            if (!isValidObjectId(product.product)) throw new Error("El ID del producto no es válido")
            if (typeof product.quantity !== "number" || product.quantity < 1) throw new Error("La cantidad debe ser un número mayor a 0")
        })

        const updatedProducts = {$set: {products: products}}// Uso $set para actualizar solo el campo products y no todo el documento.

        const updatedCart = await this.carts.findByIdAndUpdate(cid, updatedProducts, {new: true})

        if (updatedCart && updatedCart.products.length > 0) {
            return CartDTO.fromCartDocument(updatedCart) 
        } else {
            return null // Retorna null si la lista de productos del carrito está vacía.
        }
    }
        
    // Eliminar un carrito por su id.
    async deleteCartById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del carrito no es válido")
        const cart = await this.carts.findById(id)
        if (!cart) throw new Error("Carrito no encontrado")
        const deletedCart = await this.carts.findByIdAndDelete(id)
        return CartDTO.fromCartDocument(deletedCart)
    }

    // Eliminar un producto del carrito.
    async deleteProductFromCart(cid, pid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
        console.log(cid, pid)
        
        //Elimina uno de la cantidad
        const updatedCart = await this.carts.findByIdAndUpdate(cid, { $pull: {products: { product: pid } }})
        return CartDTO.fromCartDocument(updatedCart)
    }

    // Eliminar todos los productos del carrito.
    async deleteAllProductsFromCart(cid) {
        if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
        const emptyCart = await this.carts.findOneAndUpdate(
            { _id: cid },
            { $set: { products: [] } },
            { new: true, upsert: false })
            // Upsert = false, evita crear el documento si no existe.
            // New = true, retorna el documento actualizado.
        return CartDTO.fromCartDocument(emptyCart)
    }
}

