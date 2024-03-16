import cartsModel from "../models/cartsModel"

export default class CartsDao {
    constructor() {
        this.carts = cartsModel
    }

    async getCarts() {
        return await this.carts.find()
    }

    async getCartById(id) {
        return await this.carts.findById(id)
    }

    async addCart() {
        return await this.carts.create({})
    }

    async addProductToCart(id, product) {
        return await this.carts.findByIdAndUpdate(id, {$push: {products: product}})
    }

    async deleteCartById(id) {
        return await this.carts.findByIdAndDelete(id)
    }

    async deleteProductFromCart(id, productId) {
        return await this.carts.findByIdAndUpdate(id, {$pull: {products: {_id: productId}}})
    }

    async updateProductQuantity(id, productId, quantity) {
        return await this.carts.updateOne({_id: id, "products._id": productId}, {$set: {"products.$.quantity": quantity}})
    }
}
    
