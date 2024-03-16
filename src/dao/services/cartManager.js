import cartsModel from "../models/cartsModel"

export default class CartsManagerDao {
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

    async addProductToCart(id, product) {
        try {
            return await this.carts.findByIdAndUpdate(id, {$push: {products: product}})
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

    async deleteProductFromCart(id, productId) {
        try {
            return await this.carts.findByIdAndUpdate(id, {$pull: {products: {_id: productId}}})
        }
        catch (error) {
            console.error("No se pudo eliminar el producto del carrito", error)
        }
    }

    async updateProductQuantity(id, productId, quantity) {
        try {
            return await this.carts.findByIdAndUpdate(id, {$set: {products: {_id: productId, quantity: quantity}}})
        }
        catch (error) {
            console.error("No se pudo actualizar la cantidad del producto", error)
        } 
    }
}

