import mongoose from "mongoose"
import cartsModel from "../models/cartsModel"

export default class CartsManagerMongo {
    constructor() {
        this.carts = cartsModel
    }

    async getCarts() {
        try {
            return await this.carts.find()
        } 
        catch (error) {
            console.error(error)
        }
    }

    async getCartById(id) {
        try {
            return await this.carts.findById(id)
        } 
        catch (error) {
            console.error("No se pudo encontrar el carrito",error)
        }
    }

    async addCart() {
        try {
            return await this.carts.create({})
        }
        catch (error) {
            console.error("No se pudo agregar el carrito", error)
        }
    }

    async addProductToCart(cid, pid) {
        try {
            // Verificación de que el pid es un id válido en la colección de productos.
            if (!mongoose.Types.ObjectId.isValid(pid)) throw new Error("El ID del producto no es válido")
            // El método push agrega un elemento al final del array.
        return await this.carts.findByIdAndUpdate(cid, {$push: {products: pid}})
    }
    catch (error) {
        console.error("No se pudo agregar el producto al carrito", error)
    }
}

async deleteCartById(id) {
    try {
        return await this.carts.findByIdAndDelete(id)
    }
    catch (error) {
        console.error("No se pudo eliminar el carrito", error)
    }
}

async deleteProductFromCart(cid, pid) {
    try {
        //El método pull elimina un elemento del array que coincida con el valor especificado.
        return await this.carts.findByIdAndUpdate(cid, {$pull: {products: {_id: pid}}})
    }
    catch (error) {
        console.error("No se pudo eliminar el producto del carrito", error)
    }
}

async updateProductQuantity(cid, pid, quantity) {
    try {
        // Verificación de que el pid es un id válido en la colección de productos.
        if (!mongoose.Types.ObjectId.isValid(pid)) throw new Error("El ID del producto no es válido")
        //El método set actualiza un elemento del array que coincida con el valor especificado.
        return await this.carts.findOneAndUpdate(
            {_id: cid, "products._id": pid},
            {$set: {"products.$.quantity": parseInt(quantity)}})
    }
        catch (error) {
            console.error("No se pudo actualizar la cantidad del producto", error)
        } 
    }
}

