import productsModel from "../models/productsModel.js";
import logger from "../../utils/logger.js";

class ProductRepository {

    // Obtener todos los productos
    async getProducts(query, options) {
        try {
            return await productsModel.paginate(query, options);
        } catch (error) {
            logger.error("Error al obtener los productos:", error);
            throw error;
        }
    }

    // Obtener un producto por su ID
    async getProductById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await productsModel.findById(id);
        } catch (error) {
            logger.error(`Error al obtener el producto con ID ${id}:`, error);
            throw error;
        }
    }

    // Agregar un nuevo producto
    async addProduct(product) {
        try {
            const newProduct = new productsModel(product);
            return await newProduct.save();
        } catch (error) {
            logger.error("Error al agregar el producto:", error);
            throw error;
        }
    }

    // Actualizar un producto
    async updateProduct(id, product) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await productsModel.findByIdAndUpdate(id, product, { new: true });
        } catch (error) {
            logger.error(`Error al actualizar el producto con ID ${id}:`, error);
            throw error;
        }
    }

    // Eliminar un producto por su ID
    async deleteProductById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await productsModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(`Error al eliminar el producto con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new ProductRepository()
