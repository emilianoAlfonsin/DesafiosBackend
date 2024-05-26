import productsModel from "../models/productsModel.js"
import { isValidObjectId } from "../../utils.js"

class ProductDAO {
    // Obtener todos los productos paginados y ordenados.
    async getProducts({ limit = 10, page = 1, sort, category, status }) {
        const options = { limit, page, lean: true }

        // Ordenar los productos por precio
        if (sort && (sort === 'asc' || sort === 'desc')) {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }

        // Filtrar los productos por categoría y estado
        const query = {}
        if (category) query.category = category
        if (status) query.status = status

        return await productsModel.paginate(query, options)
    }

    // Obtener un producto por su id.
    async getProductById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        return await productsModel.findById(id)
    }

    // Agregar un nuevo producto.
    async addProduct(product) {
        const newProduct = new productsModel(product)
        return await newProduct.save()
    }

    // Actualizar un producto.
    async updateProduct(id, product) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        return await productsModel.findByIdAndUpdate(id, product, { new: true })
    }

    // Eliminar un producto.
    async deleteProductById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del producto no es válido")
        return await productsModel.findByIdAndDelete(id)
    }
}

export default new ProductDAO()
