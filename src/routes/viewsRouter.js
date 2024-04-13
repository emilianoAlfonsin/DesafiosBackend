import { Router } from 'express'
import ProductsManagerMongo from '../dao/services/productManager.js'
import CartsManagerMongo from '../dao/services/cartManager.js'
import { auth } from '../middlewares/auth.js'


const viewsRouter = Router()
const productManager = new ProductsManagerMongo()
const cartManager = new CartsManagerMongo()

viewsRouter.get('/', async (req, res) => {
    res.render('index')
})

viewsRouter.get('/register', (req, res) => {
    res.render('register')
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeProducts')
})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat')
})

viewsRouter.get('/products/', async (req, res) => {
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

        const productsData = await productManager.getProducts(params)
        console.log(productsData)

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
            isValid
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los productos' })
    }
})

viewsRouter.get('/products/:pid', async (req, res) => {
    try{
        const product = await productManager.getProductById(req.params.pid)
        if (!product) return res.status(404).json({ error: "El producto no se encontró" })
        res.status(200).render('productDetails', product)
    } catch (error) {
        console.error("Error al obtener el producto:", error.message)
        res.status(500).json({ error: "Error al obtener el producto" })
    }
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    try{
        const cart = await cartManager.getCartById(req.params.cid)
        if (!cart) return res.status(404).json({ error: "El carrito no se encontró" })
        res.status(200).render('cart', { cart })
    } catch (error) {
        console.error("Error al obtener el carrito:", error.message)
        res.status(500).json({ error: "Error al obtener el carrito" })
    }
})

export default viewsRouter