import cartsModel from "../models/cartsModel.js"

// Metodo de validación de id existente en la DB.
import { isValidObjectId } from "../../utils.js"

export default class CartsManagerMongo {
    constructor() {
        this.carts = cartsModel
    }

    // Devolver todos los carritos.
    async getCarts() {
        try {
            const carts = await this.carts.find()
            console.log(JSON.stringify(carts, null, "\t"))
            return carts
        } 
        catch (error) {
            console.error(error)
        }
    }

    // Devolver un carrito por su id.
    async getCartById(id) {
        try {
            const cart = await this.carts.findById(id).populate("products.product")
            if (!cart) throw new Error("Carrito no encontrado")
            const populatedCart = cart.toObject() // Convierte un documento de mongoose a un objeto plano para manipularlo con Js.
            // console.log(JSON.stringify(populatedCart, null, "\t"))
            return populatedCart
        } 
        catch (error) {
            console.error("No se pudo encontrar el carrito",error)
        }
    }

    // Crear un carrito. 
    async createCart() {
        try {
            const newCart = await this.carts.create({})
            return newCart._id.toString()// Retorna el id del carrito creado convertido a string
        }
        catch (error) {
            console.error("No se pudo agregar el carrito", error)
        }
    }

    // Agregar un producto al carrito.
    async addProductToCart(cid, pid) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
            
            //Buscar el carrito, si no existe, crearlo.
            // let cart = await this.carts.findById(cid)
            // if (!cart) {
            //     cart = await this.carts.create({ _id: cid, products: [] })
            // }

            // Buscar el carrito, si no lo encuentra lanza error.
            const cart = await this.carts.findById(cid)
            if (!cart) throw new Error("Carrito no encontrado")
            
            //Buscar el producto, si lo encuentra le suma uno a la cantidad. Si no lo encuentra le asigna quantity = 1
            const existingProductIndex = cart.products.findIndex(product => product._id.equals(pid))
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity++
                return await cart.save()
            } else {
                cart.products.push({_id: pid, quantity: 1, product: pid})
                return await cart.save()
            }
        } 
        catch (error) {
            console.error("No se pudo agregar el producto al carrito", error)
            throw error
        }
    }

    // Actualizar solo la cantidad del producto.
    async updateProductQuantity(cid, pid, quantity) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
            console.log("cid:", cid, " pid:" , pid , " quantity:" , quantity)
            
            const cart = await this.carts.findById(cid)
            if (!cart) throw new Error("Carrito no encontrado")

            const productIndex = cart.products.findIndex( product => product.product.equals(pid))
            productIndex === -1 
                ? cart = await this.carts.findByIdAndUpdate(
                    cid, 
                    {$push: {products: {_id: pid, quantity: quantity, product: pid}}}, 
                    {new: true}
                    )
                : cart.products[productIndex].quantity = quantity

            return await cart.save()

            // const updatedCart = await this.carts.updateOne({ _id: cid, "products._id": pid }, { $set: { "products.$.quantity": quantity } })
            // console.log(updatedCart)
            // return updatedCart.modifiedCount > 0 ? updatedCart : null // Retorna null si no se encontró el producto en el carrito.
        }
        catch (error) {
            console.error("No se pudo actualizar la cantidad del producto", error)
        }
    }

    //Actualizar la lista de productos del carrito con un array de productos.
    async updateCartProducts(cid, products) {
        try {
            // console.log(products)
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if(products.length === 0) throw new Error("La lista de productos no puede estar vacía")

            products.forEach(product => {
                if (!isValidObjectId(product.product)) throw new Error("El ID del producto no es válido")
                if (typeof product.quantity !== "number" || product.quantity < 1) throw new Error("La cantidad debe ser un número mayor a 0")
            })

            const updatedProducts = {$set: {products: products}}// Uso $set para actualizar solo el campo products y no todo el documento.

            const updatedCart = await this.carts.findByIdAndUpdate(cid, updatedProducts, {new: true})
            return updatedCart.products.length > 0 ? updatedCart : null // Retorna null si la lista de productos del carrito está vacía.
        }
        catch (error) {
            console.error("No se pudo actualizar la lista de productos del carrito", error)
        }
    }
        
    // Eliminar un carrito por su id.
    async deleteCartById(id) {
        try {
            if (!isValidObjectId(id)) throw new Error("El ID del carrito no es válido")
            const cart = await this.carts.findById(id)
            if (!cart) throw new Error("Carrito no encontrado")
            return await this.carts.findByIdAndDelete(id)
        }
        catch (error) {
            console.error("No se pudo eliminar el carrito", error)
            throw error
        }
    }

    // Eliminar un producto del carrito.
    async deleteProductFromCart(cid, pid) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            if (!isValidObjectId(pid)) throw new Error("El ID del producto no es válido")
            //El método pull elimina un elemento del array que coincida con el valor especificado.
            console.log(cid, pid)
            
            //Elimina uno de la cantidad porque solo le envío el id global del producto
            const updatedCart = await this.carts.findByIdAndUpdate(cid, { $pull: {products: { product: pid } }})

            //Elimina el total de la cantidad del producto.
            // const updatedCart = await this.carts.findByIdAndUpdate(cid, { $pullAll: [{products: [{ product: pid }] }]})

            return updatedCart
        }
        catch (error) {
            console.error("No se pudo eliminar el producto del carrito", error)
        }
    }

    // Eliminar todos los productos del carrito.
    async deleteAllProductsFromCart(cid) {
        try {
            if (!isValidObjectId(cid)) throw new Error("El ID del carrito no es válido")
            return await this.carts.findByIdAndUpdate(cid, { $set: { products: [] }})
        }
        catch (error) {
            console.error("No se pudo eliminar todos los productos del carrito", error)
        }
    }

}

