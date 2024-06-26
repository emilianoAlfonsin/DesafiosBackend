import CartService from "../dao/services/cart.service.js"
import ProductsService from "../dao/services/product.service.js"
import SessionService from "../dao/services/session.service.js"

const cartService = new CartService()
const productService = new ProductsService()
const sessionService = new SessionService()

export default class ViewsController {

    // Renderizado de vista de inicio
    async renderIndex(req, res) {
        try {
            res.render('index')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de inicio"
            })
        }
    }

    // Renderizador de vista de registro
    async renderRegister(req, res) {
        try {
            res.render('register')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de registro"
            })
        }
    }

    // Renderizador de vista de formulario de forgot password
    async renderForgotPassword(req, res) {
        try {
            res.render('forgotPassword')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de formulario de forgot password"
            })
        }
    }

    // Renderizador de vista de restauración de password
    async renderRestorePassword(req, res) {
        try {
            res.render('restorePassword')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de restauración de password"
            })
        }
    }

    // Renderizador de vista de reseteo de password
    async renderResetPassword(req, res) {
        try {
            res.render('resetPassword')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de reseteo de password"
            })
        }
    }

    // Renderizador de vista de realtime products
    async renderRealtimeProducts(req, res) {
        try {
            res.render('realtimeProducts')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de productos en tiempo real"
            })
        }
    }

    // Renderizador de vista de chat
    async renderChat(req, res) {
        try {
            res.render('chat')
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al renderizar la vista de chat"
            })
        }
    }

    // Renderizador de vista de productos
    async renderProducts(req, res) {
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10
            const sort = req.query.sort
            const category = req.query.category
            const status = req.query.status

            if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
                return res.status(400).json({
                    status: "failure",
                    errorCode: "INVALID_PAGINATION_PARAMS",
                    description: "Los parámetros de paginación son inválidos"
                })
            }

            const params = { 
                page, 
                limit, 
                sort, 
                category, 
                status 
            }

            const productsData = await productService.getProducts(params)
    
            // Generar enlaces de paginación "prevLink" y "nextLink"
            let prevPageUrl = productsData.hasPrevPage ? `/products?page=${page - 1}&limit=${limit}` : null
            let nextPageUrl = productsData.hasNextPage ? `/products?page=${page + 1}&limit=${limit}` : null

            if (sort) {
                prevPageUrl && (prevPageUrl += `&sort=${sort}`)
                nextPageUrl && (nextPageUrl += `&sort=${sort}`)
            }

            if (category) {
                prevPageUrl && (prevPageUrl += `&category=${category}`)
                nextPageUrl && (nextPageUrl += `&category=${category}`)
            }

            if (status) {
                prevPageUrl && (prevPageUrl += `&status=${status}`)
                nextPageUrl && (nextPageUrl += `&status=${status}`)
            }

            // Verificar si hay productos en la página actual (condición para renderizado)
            const isValid = productsData.docs.length > 0

            const sessionUser = req.session.user ? await sessionService.getCurrentUser(req.session) : null
            console.log("Usuario: ", sessionUser)

            // Enviar la respuesta con el formato requerido
            res.status(200).render('products', { 
                products: productsData.docs, 
                totalPages: productsData.totalPages, 
                page: productsData.page,
                prevPageUrl,
                nextPageUrl,
                isValid,
                user: sessionUser
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener los productos"
            })
        }
    }

    // Renderizador de vista de detalle de producto
    async renderProductDetails(req, res) {
        try {
            const productId = req.params.pid
            const product = await productService.getProductById(productId)
            if (!product) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "PRODUCT_NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }
            res.status(200).render('productDetails', { product })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el producto"
            })
        }
    }

    // Renderizador de vista de carrito
    async renderCartById(req, res) {
        try {
            const cartId = req.params.cid
            const cart = await cartService.getCartById(cartId)
            if (!cart) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "CART_NOT_FOUND",
                    description: "Carrito no encontrado"
                })
            }
            res.status(200).render('cart', { cart })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el carrito"
            })
        }
    }
}
