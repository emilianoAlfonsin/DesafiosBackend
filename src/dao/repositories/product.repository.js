import productsModel from "../models/productsModel.js"

class ProductRepository {
    async getProducts(query, options) {
        return await productsModel.paginate(query, options)
    }

    async getProductById(id) {
        return await productsModel.findById(id)
    }

    async addProduct(product) {
        const newProduct = new productsModel(product)
        return await newProduct.save()
    }

    async updateProduct(id, product) {
        return await productsModel.findByIdAndUpdate(id, product, { new: true })
    }

    async deleteProductById(id) {
        return await productsModel.findByIdAndDelete(id)
    }
}

export default new ProductRepository()
