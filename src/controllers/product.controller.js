import ProductsService from "../dao/services/product.service.js"

const productService = new ProductsService()

export default class ProductController {

//Obtener los productos (paginado)
    async getProducts(req, res) {
        try{
            const products = await productService.getProducts(req.query)
            res.status(200).json(products)
        }
        catch(error){
            console.error(error)
            res.status(500).json({error: 'Error al obtener los productos'})
            return
        }
    }

    //Obtener un producto por su id
    async getProductById(req, res) {
        try{
            const product = await productService.getProductById(req.params.id)
            if(!product){
                res.status(404).json({error: 'Producto no encontrado'})
                return
            }
            res.status(200).json(product)
        }
        catch(error){
            console.error(error)
            res.status(500).json({error: 'Error al obtener el producto'})
            return
        }
    }

    //Agregar un nuevo producto.
    async addProduct(req, res) {
        try{
            const product = await productService.addProduct(req.body)
            res.status(201).json({success: `${product.title} agregado correctamente.`})
        }
        catch(error){
            console.error(error)
            res.status(500).json({error: 'Error al agregar el producto'})
        }
    }

    //Actualizar un producto.
    async updateProduct(req, res) {
        try{
            const product = await productService.updateProduct(req.params.id, req.body)
            if(!product){
                // Si no se encuentra el producto devuelve un código de estado 404
                res.status(404).json({error: 'Producto no encontrado'})
                return
            }
            res.status(200).json({success: `${product.title} actualizado correctamente.`})
        }
        catch(error){
            console.error(error)
            res.status(500).json({error: 'Error al actualizar el producto'})
        }
    }

    //Eliminar un producto.
    async deleteProductById(req, res) {
        try{
            const product = await productService.deleteProductById(req.params.id)
            if(!product){
                res.status(404).json({error: 'Producto no encontrado'})
                return
            }
            res.status(200).json({success: `${product.title} eliminado correctamente.`})
        }
        catch(error){
            console.error(error)
            res.status(500).json({error: 'Error al eliminar el producto'})
        }
    }
}