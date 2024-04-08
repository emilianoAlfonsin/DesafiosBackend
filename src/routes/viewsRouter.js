import { Router } from 'express'
import ProductsManagerMongo from '../dao/services/productManager.js'
import CartsManagerMongo from '../dao/services/cartManager.js'
import { generatePaginationLink } from '../utils.js'

const viewsRouter = Router()
const productManager = new ProductsManagerMongo()
const cartManager = new CartsManagerMongo()

viewsRouter.get('/', async (req, res) => {
    res.render('index')
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeProducts')
})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat')
})

// viewsRouter.get('/products/', async (req, res) => {
//     try{
//         const page = parseInt(req.query.page) || 1
//         const limit = parseInt(req.query.limit) || 5
//         const sort = req.query.sort 

//         const options = {
//             page,
//             limit,
//             lean: true 
//         }

//         // Condiciones de ordenamiento "sort"
//         if (sort === 'asc' || sort === 'desc') {
//             options.sort = { price: sort === 'asc' ? 1 : -1 }
//         }
//         console.log(options)
//         // Condiciones de filtro "query"
//         const {category, status} = req.query
//         const query = {}
//         category && (query.category = category)
//         status && (query.status = status)

//         const result = await productsModel.paginate(query, options)

//         result.isValid = page >= 1 && page <= result.totalPages

//         // Generar enlaces de paginación "nextLink" y "prevLink"
//         let nextPageUrl = `/products?page=${page + 1}&limit=${limit}`
//         req.query.sort && (nextPageUrl += `&sort=${sort}`)
//         req.query.category && (nextPageUrl += `&category=${category}`)
//         req.query.status && (nextPageUrl += `&status=${status}`)
//         result.nextLink = result.hasNextPage
//             ? nextPageUrl
//             : null

//         let prevPageUrl = `/products?page=${page - 1}&limit=${limit}`
//         req.query.sort && (prevPageUrl += `&sort=${sort}`)
//         req.query.category && (prevPageUrl += `&category=${category}`)
//         req.query.status && (prevPageUrl += `&status=${status}`)
//         result.prevLink = result.hasPrevPage
//             ? prevPageUrl
//             : null

//         console.log(result.isValid);
//         res.status(200).render('products', result)
//     }
//     catch (error) {
//         console.error(error)
//         res.status(500).json({ error: 'Error al obtener los productos' })
//     }
// })

viewsRouter.get('/products/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const sort = req.query.sort
        const category = req.query.category
        const status = req.query.status

        const params = { 
            page, 
            limit, 
            ... (sort && {sort}), 
            ... (category && {category}), 
            ... (status && {status}) 
        }

        const { docs, totalPages, hasNextPage, hasPrevPage } = await productManager.getProducts(params)
        console.log(params)

        // Generar enlaces de paginación "nextLink" y "prevLink"
        const nextPageUrl = generatePaginationLink(page + 1, limit, {sort, category, status}, hasNextPage, )
        const prevPageUrl = generatePaginationLink(page - 1, limit, {sort, category, status}, hasPrevPage)

        const isValid = page >= 1 && page <= totalPages

        // Enviar la respuesta con el formato requerido
        res.status(200).render('products', { products : docs, totalPages, prevPageUrl, nextPageUrl, isValid })
    } catch (error) {
        console.error(error)
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