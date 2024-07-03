import cartsModel from "../models/cartsModel.js"

class CartRepository {
    async getAllCarts() {
        return await cartsModel.find()
    }

    async getCartById(id) {
        return await cartsModel.findById(id).populate("products.product")
    }

    async createCart(userId) {
        return await cartsModel.create({ owner: userId })
    }

    async addProductToCart(cart) {
        return await cart.save()
    }

    async updateCartProducts(cid, products) {
        return await cartsModel.findByIdAndUpdate(cid, { $set: { products } }, { new: true })
    }

    async deleteCartById(id) {
        return await cartsModel.findByIdAndDelete(id)
    }

    async updateProductQuantity(cart) {
        return await cart.save()
    }

    async deleteProductFromCart(cid, pid) {
        return await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } })
    }

    async deleteAllProductsFromCart(cid) {
        return await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true })
    }
}

export default new CartRepository()
