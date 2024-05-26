import ProductDTO from "../DTOs/product.dto.js"
import productMongoDao from "../DAOs/product.mongo.dao.js"

export default class ProductsService {
    async getProducts(params) {
        const result = await productMongoDao.getProducts(params)
        const products = ProductDTO.fromProductArray(result.docs)
        return { ...result, docs: products }
    }

    async getProductById(id) {
        const product = await productMongoDao.getProductById(id)
        if (!product) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(product)
    }

    async addProduct(product) {
        const savedProduct = await productMongoDao.addProduct(product)
        return ProductDTO.fromProductDocument(savedProduct)
    }

    async updateProduct(id, product) {
        const updatedProduct = await productMongoDao.updateProduct(id, product)
        if (!updatedProduct) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(updatedProduct)
    }

    async deleteProductById(id) {
        const deletedProduct = await productMongoDao.deleteProductById(id)
        if (!deletedProduct) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(deletedProduct)
    }
}
