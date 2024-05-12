import CartService from "../dao/services/cart.service.js"
import ProductsService from "../dao/services/product.service.js"

const cartService = new CartService()
const productService = new ProductsService()

export default class ViewsController{

    async renderIndex(req, res){
        res.render('index')
    }

    async renderRegister(req,res){
        res.render('register')
    }

    async renderRestorePassword(req, res){
        res.render('restorePassword')
    }

    async renderRealtimeProducts(req, res){
        res.render('realtimeProducts')
    }

    async renderChat(req, res){
        res.render('chat')
    }

    async renderProducts(req, res){
        try {
            const page = parseInt(req.query.page) || 1
            const limit = parseInt(req.query.limit) || 10
            const sort = req.query.sort
            const category = req.query.category
            const status = req.query.status
    
            if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
                throw new Error('Los parámetros de paginación son inválidos')
            }
    
            const params = { 
                page, 
                limit, 
                sort, 
                category, 
                status 
            }
    
            const productsData = await productService.getProducts(params)
            // console.log(productsData)
    
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
    
            // Verificar si hay productos en la página actual 
            const isValid = productsData.docs.length > 0
    
            // Enviar la respuesta con el formato requerido
            res.status(200).render('products', { 
                products: productsData.docs, 
                totalPages: productsData.totalPages, 
                page: productsData.page,
                prevPageUrl,
                nextPageUrl,
                isValid,
                user: req.session.user
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener los productos' })
        }
    }

    async renderProductDetails(req, res){
        try {
            const productId = req.params.pid
            const product = await productService.getProductById(productId)
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' })
            }
            res.status(200).render('productDetails', product)
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al obtener el producto' })
        }
    }

    async renderCartById(req, res){
        try {
            const cartId = req.params.cid
            const cart = await cartService.getCartById(cartId)
            if (!cart) {
                return res.status(404).json({ error: 'Carrito no encontrado' })
            }
            res.status(200).render('cart', { cart })
        } catch (error) {
            console.error(error)
            res.status(500).json({ error: 'Error al obtener el carrito' })
        }
    }
}