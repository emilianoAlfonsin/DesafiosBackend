import ProductRepository from '../dao/repositories/product.repository.js'
import { isValidObjectId } from '../utils/utils.js'
import ProductDTO from '../dao/DTOs/product.dto.js'

export default class ProductService {
    async getProducts({ limit = 10, page = 1, sort, category, status }) {
        const options = { limit, page, lean: true }

        if (sort && (sort === 'asc' || sort === 'desc')) {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }

        const query = {}
        if (category) query.category = category
        if (status) query.status = status

        const result = await ProductRepository.getProducts(query, options)
        return { ...result, docs: ProductDTO.fromProductArray(result.docs) }
    }

    async getProductById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        const product = await ProductRepository.getProductById(id)
        if (!product) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(product)
    }

    async addProduct(product) {
        const savedProduct = await ProductRepository.addProduct(product)
        return ProductDTO.fromProductDocument(savedProduct)
    }

    async updateProduct(id, product) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        const updatedProduct = await ProductRepository.updateProduct(id, product)
        if (!updatedProduct) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(updatedProduct)
    }

    async deleteProductById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        const deletedProduct = await ProductRepository.deleteProductById(id)
        if (!deletedProduct) throw new Error("Producto no encontrado")
        return ProductDTO.fromProductDocument(deletedProduct)
    }
}
