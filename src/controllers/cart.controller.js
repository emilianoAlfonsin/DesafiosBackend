import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";
import logger from "../utils/logger.js";
import { handleSuccess, handleError } from "../utils/responseHandler.js";

// Instancia de los servicios de carrito y producto
const cartService = new CartService();
const productService = new ProductService();

export default class CartController {
    constructor() {}

    // Método para obtener todos los carritos
    async getCarts(req, res) {
        try {
            logger.info("Iniciando la obtención de todos los carritos");
            const carts = await cartService.getCarts();
            logger.info("Carritos obtenidos exitosamente");
            return handleSuccess(res, 200, "Carritos obtenidos exitosamente", carts);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener los carritos", error);
        }
    }

    // Método para obtener un carrito por su ID
    async getCartById(req, res) {
        try {
            logger.info(`Iniciando la obtención del carrito con id: ${req.params.cid}`);
            const cart = await cartService.getCartById(req.params.cid);
            logger.info(`Carrito con id ${req.params.cid} obtenido exitosamente`);
            return handleSuccess(res, 200, `Carrito con id ${req.params.cid} obtenido exitosamente`, cart);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener el carrito", error);
        }
    }

    // Método para crear un nuevo carrito
    async createCart(req, res) {
        try {
            logger.info("Iniciando la creación de un nuevo carrito");
            const newCart = await cartService.createCart();
            logger.info("Carrito creado exitosamente");
            return handleSuccess(res, 201, "Carrito creado exitosamente", newCart);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al crear el carrito", error);
        }
    }

    // Método para agregar un producto al carrito
    async addProductToCart(req, res) {
        try {
            logger.info(`Iniciando la adición del producto con id ${req.params.pid} al carrito con id ${req.params.cid}`);
            const product = await productService.getProductById(req.params.pid);
            if (!product) {
                logger.warn(`Producto con id ${req.params.pid} no encontrado`);
                return handleError(res, 404, "NOT_FOUND", "Producto no encontrado", new Error("Producto no encontrado"));
            }

            // Verifica si el usuario premium intenta agregar su propio producto
            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                logger.warn(`Usuario premium ${req.session.user.email} intentó agregar su propio producto al carrito`);
                return handleError(res, 403, "FORBIDDEN", "No tienes permiso para agregar este producto al carrito", new Error("No tienes permiso para agregar este producto al carrito"));
            }

            const cart = await cartService.addProductToCart(req.params.cid, req.params.pid);
            logger.info(`Producto con id ${req.params.pid} agregado al carrito con id ${req.params.cid} exitosamente`);
            return handleSuccess(res, 200,"Producto agregado con éxito", cart);
        } catch (error) {
            return handleError(res, "Error al agregar el producto al carrito", error);
        }
    }

    // Método para actualizar un carrito
    async updateCart(req, res) {
        try {
            logger.info(`Iniciando la actualización del carrito con id ${req.params.cid}`);
            const cart = await cartService.updateCart(req.params.cid, req.body);
            logger.info(`Carrito con id ${req.params.cid} actualizado exitosamente`);
            return handleSuccess(res, 200,"Carrito actualizado con éxito",cart);
        } catch (error) {
            return handleError(res, "Error al actualizar el carrito", error);
        }
    }

    // Método para actualizar la cantidad de un producto en el carrito
    async updateProductQuantity(req, res) {
        try {
            logger.info(`Iniciando la actualización de la cantidad del producto con id ${req.params.pid} en el carrito con id ${req.params.cid}`);
            const product = await productService.getProductById(req.params.pid);
            if (!product) {
                logger.warn(`Producto con id ${req.params.pid} no encontrado`);
                return handleError(res, 404, "NOT_FOUND", "Producto no encontrado", new Error("Producto no encontrado"));
            }

            // Verifica si el usuario premium intenta actualizar la cantidad de su propio producto
            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                logger.warn(`Usuario premium ${req.session.user.email} intentó actualizar la cantidad de su propio producto`);
                return handleError(res, 403, "FORBIDDEN", "No tienes permiso para actualizar la cantidad de este producto", new Error("No tienes permiso para actualizar la cantidad de este producto"));
            }

            const cart = await cartService.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
            logger.info(`Cantidad del producto con id ${req.params.pid} en el carrito con id ${req.params.cid} actualizada exitosamente`);
            return handleSuccess(res, 200,"Cantidad actualizada con éxito", cart);
        } catch (error) {
            return handleError(res, "Error al actualizar la cantidad del producto", error);
        }
    }

    // Método para eliminar un producto del carrito
    async deleteProductFromCart(req, res) {
        try {
            logger.info(`Iniciando la eliminación del producto con id ${req.params.pid} del carrito con id ${req.params.cid}`);
            const product = await productService.getProductById(req.params.pid);
            if (!product) {
                logger.warn(`Producto con id ${req.params.pid} no encontrado`);
                return handleError(res, 404, "NOT_FOUND", "Producto no encontrado", new Error("Producto no encontrado"));
            }

            // Verifica si el usuario premium intenta eliminar su propio producto
            if (req.session.user.role === 'premium' && product.owner === req.session.user.email) {
                logger.warn(`Usuario premium ${req.session.user.email} intentó eliminar su propio producto del carrito`);
                return handleError(res, 403, "FORBIDDEN", "No tienes permiso para eliminar este producto del carrito", new Error("No tienes permiso para eliminar este producto del carrito"));
            }

            const cart = await cartService.deleteProductFromCart(req.params.cid, req.params.pid);
            logger.info(`Producto con id ${req.params.pid} eliminado del carrito con id ${req.params.cid} exitosamente`);
            return handleSuccess(res, 200, "Producto eliminado exitosamente", cart);
        } catch (error) {
            return handleError(res, "Error al eliminar el producto del carrito", error);
        }
    }

    // Método para eliminar todos los productos del carrito
    async deleteAllProductsFromCart(req, res) {
        try {
            logger.info(`Iniciando la eliminación de todos los productos del carrito con id ${req.params.cid}`);
            const cart = await cartService.deleteAllProductsFromCart(req.params.cid);
            logger.info(`Todos los productos del carrito con id ${req.params.cid} eliminados exitosamente`);
            return handleSuccess(res, 200, "Productos del carrito eliminados exitosamente",cart);
        } catch (error) {
            return handleError(res, "Error al eliminar todos los productos del carrito", error);
        }
    }

    // Método para finalizar la compra del carrito
    async purchaseCart(req, res) {
        try {
            logger.info(`Iniciando el proceso de compra del carrito con id ${req.params.cid}`);
            const cartId = req.params.cid;
            const ticket = await cartService.purchaseCart(cartId);
            logger.info(`Proceso de compra del carrito con id ${cartId} finalizado exitosamente`);
            return handleSuccess(res, 200, "Compra realizada con exito", ticket);
        } catch (error) {
            return handleError(res, "Error al finalizar el proceso de compra del carrito", error);
        }
    }
}