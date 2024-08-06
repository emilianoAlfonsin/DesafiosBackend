import ProductRepository from '../dao/repositories/product.repository.js'
import { isValidObjectId } from '../utils/utils.js'
import ProductDTO from '../dao/DTOs/product.dto.js'
import logger from '../utils/logger.js'

export default class ProductService {
    // Obtener productos con opciones de paginación, orden, categoría y estado
    async getProducts({ limit = 10, page = 1, sort, category, status }) {
        logger.info("Obteniendo productos con filtros y paginación")
        const options = { limit, page, lean: true }

        if (sort && (sort === 'asc' || sort === 'desc')) {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }

        const query = {}
        if (category) query.category = category
        if (status) query.status = status

        const result = await ProductRepository.getProducts(query, options)
        logger.info("Productos obtenidos exitosamente")
        return { ...result, docs: ProductDTO.fromProductArray(result.docs) }
    }

    // Obtener producto por ID
    async getProductById(id) {
        logger.info(`Obteniendo producto con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("El ID del producto no es válido")
            throw new Error("El ID del producto no es válido")
        }
        const product = await ProductRepository.getProductById(id)
        if (!product) {
            logger.error("Producto no encontrado")
            throw new Error("Producto no encontrado")
        }
        logger.info(`Producto con ID: ${id} obtenido exitosamente`)
        return ProductDTO.fromProductDocument(product)
    }

    // Agregar un nuevo producto
    async addProduct(product) {
        logger.info("Agregando nuevo producto")
        const savedProduct = await ProductRepository.addProduct(product)
        logger.info("Producto agregado exitosamente")
        return ProductDTO.fromProductDocument(savedProduct)
    }

    // Actualizar un producto existente por ID
    async updateProduct(id, product) {
        logger.info(`Actualizando producto con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("El ID del producto no es válido")
            throw new Error("El ID del producto no es válido")
        }
        const updatedProduct = await ProductRepository.updateProduct(id, product)
        if (!updatedProduct) {
            logger.error("Producto no encontrado")
            throw new Error("Producto no encontrado")
        }
        logger.info(`Producto con ID: ${id} actualizado exitosamente`)
        return ProductDTO.fromProductDocument(updatedProduct)
    }

    // Eliminar un producto por ID
    async deleteProductById(id) {
        logger.info(`Eliminando producto con ID: ${id}`)
        if (!isValidObjectId(id)) {
            logger.error("El ID del producto no es válido")
            throw new Error("El ID del producto no es válido")
        }
        const deletedProduct = await ProductRepository.deleteProductById(id)
        if (!deletedProduct) {
            logger.error("Producto no encontrado")
            throw new Error("Producto no encontrado")
        }
        logger.info(`Producto con ID: ${id} eliminado exitosamente`)
        return ProductDTO.fromProductDocument(deletedProduct)
    }
}
