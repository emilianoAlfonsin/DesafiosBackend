import { Router } from "express"
import ProductManager from "../managers/productManager.js"

const productRouter = Router()
const productManager = new ProductManager('./data/products.json')

// Obtener todos los productos.
productRouter.get('/', async (req, res) => {
    try{
        const products = await productManager.getProducts()
        const limit = req.query.limit
        limit > 0
        ? res.json(products.slice(0, limit))
        : res.json(products)
    } catch (error) {
        console.error(error)
        res.status(404).json({ error: 'Productos no encontrados' })
        return
    }
})

// Obtener un producto por su Id. [Requerida]
productRouter.get('/:pid/', async (req, res) => {
    try{
        const product = await productManager.getProductById(req.params.pid)
        res.json(product)
    } catch (error) {  
        console.error(error)
        res.status(404).json({ error: 'Producto no encontrado' })
        return
    }
})

// Agregar un nuevo producto. [Requerida]
productRouter.post('/', async (req, res) => {
    try{
        const product = req.body
        await productManager.addProduct(product.title, product.description, product.price, product.thumbnail, product.code, product.stock, product.status)
        res.status(201).json({ success: `${product.title} agregado correctamente.` })
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: 'Error al agregar el producto' })
    }
})

// Actualizar producto. [Requerida]
productRouter.put('/:pid/', async (req, res) => {
    try {
        // Obtener el producto por su Id.
        const product = await productManager.getProductById(req.params.pid)
        if (!product) {
            // Si no se encuentra el producto devuelve un código de estado 404
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body)
        res.status(200).json({ success: 'Producto actualizado correctamente', product: updatedProduct })
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).json({ error: 'Ocurrió un error al actualizar el producto' })
    }
})

// Eliminar un producto mediante su Id. [Requerida]
productRouter.delete('/:pid/', async (req, res) => {
    try{
        await productManager.deleteProductById(req.params.pid)
        res.json("Producto eliminado")
    } catch (error) {
        console.error(error)
        res.status(404).json({ error: 'Producto no encontrado' })
        return       
    }
})

export default productRouter