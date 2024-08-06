import { Router } from "express";
import CartController from "../controllers/cart.controller.js";
import { auth } from "../middlewares/auth.js"; 

const cartRouter = Router();
const cartController = new CartController();

// Obtener todos los carritos.
cartRouter.get('/', auth, cartController.getCarts);

// Obtener un carrito por su id.
cartRouter.get('/:cid/', auth, cartController.getCartById);

// Crear un nuevo carrito.
cartRouter.post('/', auth, cartController.createCart);

// Agregar un producto al carrito por su id.
cartRouter.post('/:cid/products/:pid/', auth, cartController.addProductToCart);

// Actualizar un carrito con un array de productos.
cartRouter.put('/:cid/', auth, cartController.updateCart);

// Actualizar solo la cantidad del producto.
cartRouter.put('/:cid/products/:pid/', auth, cartController.updateProductQuantity);

// Eliminar un producto del carrito por su id.
cartRouter.delete('/:cid/products/:pid/', auth, cartController.deleteProductFromCart);

// Eliminar todos los productos del carrito.
cartRouter.delete('/:cid/', auth, cartController.deleteAllProductsFromCart);

// Ruta para finalizar el proceso de compra del carrito.
cartRouter.post('/:cid/purchase/', auth, cartController.purchaseCart);

export default cartRouter;