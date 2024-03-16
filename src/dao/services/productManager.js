import { productsModel } from "../models/productsModel"

export default class ProductsDao {
    constructor() {
        this.model = productsModel
    }

    async getProducts() {
        return await this.model.find()
    }

    async getProductById(id) {
        return await this.model.findById(id)
    }

    async addProduct(product) {
        return await this.model.create(product)
    }

    async updateProduct(id, product) {
        return await this.model.findByIdAndUpdate({_id:id}, product)
    }

    async deleteProductById(id) {
        return await this.model.findByIdAndDelete({_id:id})
    } 
}