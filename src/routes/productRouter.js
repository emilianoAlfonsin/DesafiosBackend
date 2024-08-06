import { Router } from "express"
import ProductController from "../controllers/product.controller.js"
import { auth } from "../middlewares/auth.js"

const productRouter = Router()
const productController = new ProductController()

// Obtener todos los productos. (paginado)
productRouter.get('/', productController.getProducts.bind(productController))

// Obtener un producto por su Id. 
productRouter.get('/:pid/', productController.getProductById.bind(productController))

// Agregar un nuevo producto. (Requiere autenticación)
productRouter.post('/', auth, productController.addProduct.bind(productController))

// Actualizar producto. (Requiere autenticación)
productRouter.put('/:pid/', auth, productController.updateProduct.bind(productController))

// Eliminar un producto mediante su Id. (Requiere autenticación)
productRouter.delete('/:pid/', auth, productController.deleteProductById.bind(productController))

export default productRouter