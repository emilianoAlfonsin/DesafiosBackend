import CartService from "../services/cart.service.js";
import ProductService from "../services/product.service.js";
import SessionService from "../services/session.service.js";
import logger from "../utils/logger.js";
import { handleSuccess, handleError } from "../utils/responseHandler.js";

const cartService = new CartService();
const productService = new ProductService();
const sessionService = new SessionService();

export default class ViewsController {

    // Renderizado de vista de inicio
    async renderIndex(req, res) {
        try {
            logger.info("Renderizando vista de inicio");
            res.render('index');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de inicio", error);
        }
    }

    // Renderizador de vista de registro
    async renderRegister(req, res) {
        try {
            logger.info("Renderizando vista de registro");
            res.render('register');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de registro", error);
        }
    }

    // Renderizador de vista de formulario de forgot password
    async renderForgotPassword(req, res) {
        try {
            logger.info("Renderizando vista de formulario de forgot password");
            res.render('forgotPassword');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de formulario de forgot password", error);
        }
    }

    // Renderizador de vista de restauración de password
    async renderRestorePassword(req, res) {
        try {
            logger.info("Renderizando vista de restauración de password");
            res.render('restorePassword');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de restauración de password", error);
        }
    }

    // Renderizador de vista de reseteo de password
    async renderResetPassword(req, res) {
        try {
            logger.info("Renderizando vista de reseteo de password");
            res.render('resetPassword');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de reseteo de password", error);
        }
    }

    // Renderizador de vista de realtime products
    async renderRealtimeProducts(req, res) {
        try {
            logger.info("Renderizando vista de productos en tiempo real");
            res.render('realtimeProducts');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de productos en tiempo real", error);
        }
    }

    // Renderizador de vista de chat
    async renderChat(req, res) {
        try {
            logger.info("Renderizando vista de chat");
            res.render('chat');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de chat", error);
        }
    }

    // Renderizador de vista de productos
    async renderProducts(req, res) {
        try {
            logger.info("Renderizando vista de productos");
            const { page = 1, limit = 10, sort, category, status } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);

            if (isNaN(pageNum) || isNaN(limitNum) || pageNum <= 0 || limitNum <= 0) {
                return handleError(res, 400, "INVALID_PAGINATION_PARAMS", "Los parámetros de paginación son inválidos", new Error("Los parámetros de paginación son inválidos"));
            }

            const params = { 
                page: pageNum, 
                limit: limitNum, 
                sort, 
                category, 
                status 
            };

            const productsData = await productService.getProducts(params);
    
            // Generar enlaces de paginación "prevLink" y "nextLink"
            const generatePageUrl = (page, limit, sort, category, status) => {
                let url = `/products?page=${page}&limit=${limit}`;
                if (sort) url += `&sort=${sort}`;
                if (category) url += `&category=${category}`;
                if (status) url += `&status=${status}`;
                return url;
            };

            const prevPageUrl = productsData.hasPrevPage ? generatePageUrl(pageNum - 1, limitNum, sort, category, status) : null;
            const nextPageUrl = productsData.hasNextPage ? generatePageUrl(pageNum + 1, limitNum, sort, category, status) : null;

            // Verificar si hay productos en la página actual (condición para renderizado)
            const isValid = productsData.docs.length > 0;

            const sessionUser = req.session.user ? await sessionService.getCurrentUser(req.session) : null;
            logger.info(`Usuario: ${sessionUser}`);
            
            // Enviar la respuesta con el formato requerido
            res.render('products', { 
                products: productsData.docs, 
                totalPages: productsData.totalPages, 
                page: productsData.page,
                prevPageUrl,
                nextPageUrl,
                isValid,
                user: sessionUser
            });
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener los productos", error);
        }
    }

    // Renderizador de vista de detalle de producto
    async renderProductDetails(req, res) {
        try {
            logger.info("Renderizando vista de detalle de producto");
            const productId = req.params.pid;
            const product = await productService.getProductById(productId);
            if (!product) {
                return handleError(res, 404, "PRODUCT_NOT_FOUND", "Producto no encontrado", new Error("Producto no encontrado"));
            }
            res.render('productDetails', { product });
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener el producto", error);
        }
    }

    // Renderizador de vista de carrito
    async renderCartById(req, res) {
        try {
            logger.info("Renderizando vista de carrito");
            const cartId = req.params.cid;
            const cart = await cartService.getCartById(cartId);
            if (!cart) {
                return handleError(res, 404, "CART_NOT_FOUND", "Carrito no encontrado", new Error("Carrito no encontrado"));
            }
            res.render('cart', { cart });
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener el carrito", error);
        }
    }

    // renderizador de eliminacion de usuario
    async renderDeleteUser(req, res) {
        try {
            logger.info("Renderizando vista de eliminación de usuario");
            res.render('deleteUser');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de eliminación de usuario", error);
        }
    }

    //Renderizador de actualizacion de rol de usuario
    async renderUpdateUserRole(req, res) {
        try {
            logger.info("Renderizando vista de actualización de rol de usuario");
            res.render('updateUserRole');
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al renderizar la vista de actualización de rol de usuario", error);
        }
    }
}
