import { Router } from 'express'
import ProductsManagerDao from '../dao/services/productManager.js'

const viewsRouter = Router()
const productManager = new ProductsManagerDao()

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts()
    res.render('index', { products })
})

viewsRouter.get('/realtimeproducts', (req, res) => {
    res.render('realtimeProducts')
})

viewsRouter.get('/chat', (req, res) => {
    res.render('chat')
})
export default viewsRouter