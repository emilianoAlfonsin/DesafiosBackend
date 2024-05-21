import { Router } from "express"
import ProductController from "../controllers/product.controller.js"

const productRouter = Router()
const productController = new ProductController()

// Obtener todos los productos. (paginado)
productRouter.get('/', productController.getProducts)

// Obtener un producto por su Id. 
productRouter.get('/:pid/', productController.getProductById.bind(productController))

// Agregar un nuevo producto. 
productRouter.post('/', productController.addProduct)

// Actualizar producto.
productRouter.put('/:pid/', productController.updateProduct)

// Eliminar un producto mediante su Id. 
productRouter.delete('/:pid/', productController.deleteProductById)

export default productRouter