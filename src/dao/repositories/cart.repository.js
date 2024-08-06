import cartsModel from "../models/cartsModel.js";
import logger from "../../utils/logger.js";

class CartRepository {
    // Obtener todos los carritos
    async getAllCarts() {
        try {
            return await cartsModel.find();
        } catch (error) {
            logger.error("Error al obtener todos los carritos:", error);
            throw error;
        }
    }

    // Obtener un carrito por su ID
    async getCartById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await cartsModel.findById(id).populate("products.product");
        } catch (error) {
            logger.error(`Error al obtener el carrito con ID ${id}:`, error);
            throw error;
        }
    }

    // Crear un nuevo carrito
    async createCart(userId) {
        try {
            if (!userId) throw new Error("El ID del usuario es requerido");
            return await cartsModel.create({ owner: userId });
        } catch (error) {
            logger.error("Error al crear el carrito:", error);
            throw error;
        }
    }

    // Agregar un producto al carrito
    async addProductToCart(cart) {
        try {
            if (!cart) throw new Error("El carrito es requerido");
            return await cart.save();
        } catch (error) {
            logger.error("Error al agregar producto al carrito:", error);
            throw error;
        }
    }

    // Actualizar los productos del carrito
    async updateCartProducts(cid, products) {
        try {
            if (!cid) throw new Error("El ID del carrito es requerido");
            if (!Array.isArray(products)) throw new Error("Los productos deben ser un array");
            return await cartsModel.findByIdAndUpdate(cid, { $set: { products } }, { new: true });
        } catch (error) {
            logger.error(`Error al actualizar los productos del carrito con ID ${cid}:`, error);
            throw error;
        }
    }

    // Eliminar un carrito por su ID
    async deleteCartById(id) {
        try {
            if (!id) throw new Error("El ID es requerido");
            return await cartsModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(`Error al eliminar el carrito con ID ${id}:`, error);
            throw error;
        }
    }

    // Actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(cart) {
        try {
            if (!cart) throw new Error("El carrito es requerido");
            return await cart.save();
        } catch (error) {
            logger.error("Error al actualizar la cantidad del producto en el carrito:", error);
            throw error;
        }
    }

    // Eliminar un producto del carrito
    async deleteProductFromCart(cid, pid) {
        try {
            if (!cid) throw new Error("El ID del carrito es requerido");
            if (!pid) throw new Error("El ID del producto es requerido");
            return await cartsModel.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } });
        } catch (error) {
            logger.error(`Error al eliminar el producto con ID ${pid} del carrito con ID ${cid}:`, error);
            throw error;
        }
    }

    // Eliminar todos los productos del carrito
    async deleteAllProductsFromCart(cid) {
        try {
            if (!cid) throw new Error("El ID del carrito es requerido");
            return await cartsModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true });
        } catch (error) {
            logger.error(`Error al eliminar todos los productos del carrito con ID ${cid}:`, error);
            throw error;
        }
    }
}

export default new CartRepository();
