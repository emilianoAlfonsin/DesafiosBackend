import { Router } from "express"
import ProductsManagerDao from "../dao/services/productManager.js"

const productRouter = Router()
const productManager = new ProductsManagerDao()

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
        res.status(500).json({ error: 'Eror al obtener los productos' })
        return
    }
})

// Obtener un producto por su Id. [Requerida]
productRouter.get('/:pid/', async (req, res) => {
    try{
        const product = await productManager.getProductById(req.params.pid)
        if (!product) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }
        res.json(product)
    } catch (error) {  
        console.error(error)
        res.status(500).json({ error: 'Error al obtener el producto' })
        return
    }
})

// Agregar un nuevo producto. [Requerida]
productRouter.post('/', async (req, res) => {
    try{
        const product = req.body
        await productManager.addProduct(product)
        res.status(201).json({ success: `${product.title} agregado correctamente.` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al agregar el producto' })
    }
})

// Actualizar producto. [Requerida]
productRouter.put('/:pid/', async (req, res) => {
    try {
        const updatedProduct = await productManager.updateProduct(req.params.pid, req.body)
        if (!updatedProduct) {
            // Si no se encuentra el producto devuelve un código de estado 404
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }
        res.status(200).json({ success: 'Producto actualizado correctamente', product: updatedProduct })
    } catch (error) {
        console.error('Error al actualizar el producto:', error)
        res.status(500).json({ error: 'Ocurrió un error al actualizar el producto' })
    }
})

// Eliminar un producto mediante su Id. [Requerida]
productRouter.delete('/:pid/', async (req, res) => {
    try{
        const deletedProduct = await productManager.deleteProductById(req.params.pid)
        if (!deletedProduct) {
            res.status(404).json({ error: 'Producto no encontrado' })
            return
        }
        res.status(200).json({ success: `Producto ${deletedProduct} eliminado correctamente` })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al eliminar el producto' })
        return       
    }
})

export default productRouter