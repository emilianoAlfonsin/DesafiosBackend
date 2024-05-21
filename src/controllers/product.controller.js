import ProductsService from "../dao/services/product.service.js"

const productService = new ProductsService()

export default class ProductController {

//Obtener los productos (paginado)
    async getProducts(req, res) {
        try {
            const products = await productService.getProducts(req.query)
            if (!products.docs.length) {
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "No se encuentran productos para mostrar"
                })
            }
            res.status(200).json({
                status: "success",
                payload: products
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener los productos"
            })
        }
    }

    //Obtener un producto por su id
    async getProductById(req, res) {
        console.log("Parametro: ",req.params.pid)
        try {
            const productId = req.params.pid
            console.log(`Buscando producto con id: ${productId}`)

            const product = await productService.getProductById(productId)
            if (!product) {
                res.status(404).json({
                    status: "failure",
                    errorCode: "PRODUCT_NOT_FOUND",
                    description: "Producto no encontrado"
                })
                return
            }
            res.status(200).json({
                status: "success",
                payload: product
            })
        } catch (error) {
            console.error(`Error al buscar el producto con id: ${req.params.id}`)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al obtener el producto"
            });
        }
    }

    //Agregar un nuevo producto.
    async addProduct(req, res) {
        try{
            const product = await productService.addProduct(req.body)
            res.status(201).json({
                status: "success",
                payload: {
                    message: `${product.title} agregado correctamente.`,
                    product: product
                }
            })
        }
        catch(error){
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al agregar el producto"
            })
        }
    }

    //Actualizar un producto.
    async updateProduct(req, res) {
        try{
            const product = await productService.updateProduct(req.params.id, req.body)
            if(!product){
                // Si no se encuentra el producto devuelve un código de estado 404
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }
            res.status(200).json({
                status: "success",
                payload: {
                    message: `${product.title} actualizado correctamente.`,
                    product: product
                }
            })
        }
        catch(error){
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al actualizar el producto"
            })
        }
    }

    //Eliminar un producto.
    async deleteProductById(req, res) {
        try{
            const product = await productService.deleteProductById(req.params.id)
            if(!product){
                return res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Producto no encontrado"
                })
            }
            res.status(200).json({
                status: "success",
                payload: {
                    message: `${product.title} eliminado correctamente.`,
                    product: product
                }
            })
        }
        catch(error){
            console.error(error)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al actualizar el producto"
            })
        }
    }
}