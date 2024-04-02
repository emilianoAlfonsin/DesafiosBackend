import { Router } from "express"
import ProductsManagerMongo from "../dao/services/productManager.js"
import productsModel from "../dao/models/productsModel.js"

const productRouter = Router()
const productManager = new ProductsManagerMongo()

// Obtener todos los productos. FileSystem
// productRouter.get('/', async (req, res) => {
//     try{
//         const products = await productManager.getProducts()
//         const limit = req.query.limit
//         limit > 0
//         ? res.json(products.slice(0, limit))
//         : res.json(products)
//     } catch (error) {
//         console.error(error)
//         res.status(500).json({ error: 'Eror al obtener los productos' })
//         return
//     }
// })

productRouter.get('/', async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5
        const sort = req.query.sort 

        const options = {
            page,
            limit,
            lean: true
        }

        // Condiciones de ordenamiento "sort"
        if (sort === 'asc' || sort === 'desc') {
            options.sort = { price: sort === 'asc' ? 1 : -1 }
        }
        console.log(options);
        // Condiciones de filtro "query"
        const {category, status} = req.query
        const query = {}
        category && (query.category = category)
        status && (query.status = status)

        const result = await productsModel.paginate(query, options)

        result.isValid = page >= 1 && page <= result.totalPages

        // Generar enlaces de paginación "nextLink" y "prevLink"
        let nextPageUrl = `/api/products?page=${page + 1}&limit=${limit}`
        req.query.sort && (nextPageUrl += `&sort=${sort}`)
        req.query.category && (nextPageUrl += `&category=${category}`)
        req.query.status && (nextPageUrl += `&status=${status}`)
        result.nextLink = result.hasNextPage
            ? nextPageUrl
            : null

        let prevPageUrl = `/api/products?page=${page - 1}&limit=${limit}`
        req.query.sort && (prevPageUrl += `&sort=${sort}`)
        req.query.category && (prevPageUrl += `&category=${category}`)
        req.query.status && (prevPageUrl += `&status=${status}`)
        result.prevLink = result.hasPrevPage
            ? prevPageUrl
            : null

        console.log(result.isValid);
        res.status(200).render('products', result)
    }
    catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener los productos' })
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
        res.status(200).json(product)
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