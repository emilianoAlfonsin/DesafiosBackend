import ProductsService from "../services/product.service.js";
import logger from "../utils/logger.js";
import { handleSuccess, handleError } from "../utils/responseHandler.js";

const productService = new ProductsService();

export default class ProductController {
    constructor() {}

    // Obtener los productos (paginado)
    async getProducts(req, res) {
        try {
            logger.info("Iniciando obtención de productos");
            const products = await productService.getProducts(req.query);
            if (!products.docs.length) {
                logger.warn("No se encuentran productos para mostrar");
                return handleError(res, 404, "NOT_FOUND", "No se encuentran productos para mostrar");
            }
            logger.info("Productos obtenidos correctamente");
            return handleSuccess(res, 200,"Productos obtenidos exitosamente", products);
        } catch (error) {
            logger.error("Error al obtener los productos", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener los productos", error);
        }
    }

    // Obtener un producto por su id
    async getProductById(req, res) {
        try {
            const productId = req.params.pid;
            logger.info(`Iniciando obtención del producto con id: ${productId}`);
            const product = await productService.getProductById(productId);
            if (!product) {
                logger.warn(`Producto no encontrado con id: ${productId}`);
                return handleError(res, 404, "PRODUCT_NOT_FOUND", `Producto no encontrado con id: ${productId}`);
            }
            logger.info(`Producto con id: ${productId} obtenido correctamente`);
            return handleSuccess(res, 200,"Producto obtenido correctamente", product);
        } catch (error) {
            logger.error(`Error al obtener el producto con id: ${req.params.pid}`, error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", `Error al obtener el producto con id: ${req.params.pid}`, error);
        }
    }

    // Validar campos requeridos
    validateRequiredFields(fields, body) {
        return fields.filter(field => !body[field]);
    }

    // Agregar un nuevo producto
    async addProduct(req, res) {
        try {
            logger.info("Iniciando adición de un nuevo producto");
            const requiredFields = ["title", "description", "thumbnail", "price", "code", "stock", "category", "status"];
            const missingFields = this.validateRequiredFields(requiredFields, req.body);
            if (missingFields.length) {
                logger.warn(`Campos requeridos faltantes: ${missingFields.join(", ")}`);
                return handleError(res, 400, "BAD_REQUEST", `Campos requeridos: ${missingFields.join(", ")}`);
            }
            const product = await productService.addProduct(req.body);
            if (!product) {
                logger.warn("Error al agregar el producto");
                return handleError(res, 400, "BAD_REQUEST", "Error al agregar el producto");
            }
            logger.info(`Producto ${product.title} agregado correctamente`);
            return handleSuccess(res, 201, `${product.title} agregado correctamente.`, product);
        } catch (error) {
            logger.error("Error al agregar el producto", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al agregar el producto", error);
        }
    }

    // Verificar permisos del usuario
    checkUserPermission(req, product) {
        return req.session.user && (req.session.user.role === "premium" || req.session.user.email === product.owner);
    }

    // Actualizar un producto
    async updateProduct(req, res) {
        try {
            logger.info(`Iniciando actualización del producto con id: ${req.params.id}`);
            const product = await productService.updateProduct(req.params.id, req.body);
            if (!this.checkUserPermission(req, product)) {
                logger.warn("No tienes permiso para modificar este producto");
                return handleError(res, 403, "FORBIDDEN", "No tienes permiso para modificar este producto");
            }
            if (!product) {
                logger.warn("Producto no encontrado");
                return handleError(res, 404, "NOT_FOUND", "Producto no encontrado");
            }
            logger.info(`Producto ${product.title} actualizado correctamente`);
            return handleSuccess(res, 200, `${product.title} actualizado correctamente.`, product);
        } catch (error) {
            logger.error("Error al actualizar el producto", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al actualizar el producto", error);
        }
    }

    // Eliminar un producto
    async deleteProductById(req, res) {
        try {
            logger.info(`Iniciando eliminación del producto con id: ${req.params.id}`);
            const product = await productService.deleteProductById(req.params.id);
            if (!this.checkUserPermission(req, product)) {
                logger.warn("No tienes permiso para eliminar este producto");
                return handleError(res, 403, "FORBIDDEN", "No tienes permiso para eliminar este producto");
            }
            if (!product) {
                logger.warn("Producto no encontrado");
                return handleError(res, 404, "NOT_FOUND", "Producto no encontrado");
            }
            logger.info(`Producto ${product.title} eliminado correctamente`);
            return handleSuccess(res, 200, `${product.title} eliminado correctamente.`, product);
        } catch (error) {
            logger.error("Error al eliminar el producto", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al eliminar el producto", error);
        }
    }
}