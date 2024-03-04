import { Router } from 'express'
import ProductManager from '../managers/productManager.js'

const viewsRouter = Router()
const productManager = new ProductManager('./data/products.json')

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('index', { products })
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeProducts')
})

export default viewsRouter