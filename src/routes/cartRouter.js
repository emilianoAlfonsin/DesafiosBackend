import { Router } from "express"
import CartController from "../dao/controllers/cart.controller.js";

const cartRouter = Router()
const cartController = new CartController()

// Obtener todos los carritos.
cartRouter.get('/', cartController.getCarts)

// Obtener un carrito por su id. 
cartRouter.get('/:cid/', cartController.getCartById)

// Crear un nuevo carrito. 
cartRouter.post('/', cartController.createCart)

// Agregar un producto al carrito por su id. 
cartRouter.post('/:cid/products/:pid/', cartController.addProductToCart)

//Actualizar un carrito con un array de productos.
cartRouter.put('/:cid/', cartController.updateCart)

//Actualizar solo la cantidad del producto.
cartRouter.put('/:cid/products/:pid/', cartController.updateProductQuantity)

//Eliminar un producto del carrito por su id.
cartRouter.delete('/:cid/products/:pid/', cartController.deleteProductFromCart)

//Eliminar todos los productos del carrito.
cartRouter.delete('/:cid/', cartController.deleteAllProductsFromCart)


export default cartRouter