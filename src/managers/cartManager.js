import fs from 'fs';

export default class CartManager {

    cart = new Array()

    constructor(path) {
        this.path = path
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, '[]')
            console.log("Archivo creado")
        }
    }   

    // Método para obtener todos los carritos del array de carritos.
    getCarts = async() =>{
        const cartsData = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(cartsData)
    }

    // Método para obtener un carrito por su id.
    getCartById = async(id) =>{
        const carts = await this.getCarts()
        const cartId = parseInt(id)
        const cartById = carts.find(cart => cart.id === cartId)
        
        if (!cartById) throw new Error("No se encuentra el carrito") 

        console.log(cartById) 

        return cartById
    }

    // Método para agregar un carrito al array de carritos.
    addCart = async() =>{
        const carts = await this.getCarts()
        const cartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1
        const newCart = {id: cartId, products: []}
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4))
        return newCart
    }

    // Método para agregar un producto al carrito seleccionado desde products.json
    addProductToCart = async(cid, pid) =>{ 
        // busqueda de carrito por id, si no lo encuentra lo crea
        let cart = await this.getCartById(cid) 
        if (!cart) cart = await this.addCart()

        // busqueda de producto por id en el carrito
        const productInCart = cart.products.find(product => product.id === pid) 

        // si existe el producto, le suma 1 a la cantidad, si no existe lo crea.
        productInCart
        ? cart.products[productInCart].quantity++
        : cart.products.push({id: pid, quantity: 1})

        // Obtener todos los carritos, actualizar el carrito específico y escribir los carritos actualizados en el archivo.
        const allCarts = await this.getCarts()
        const updatedCarts = allCarts.map(c=> c.id === cid ? cart : c)
        await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts, null, 4))

        return cart
    }

    // Método para eliminar un carrito del array de carritos.
    deleteCartById = async(id) =>{
        const carts = await this.getCarts()
        const cartIndex = carts.findIndex(cart => cart.id === id);

        if (cartIndex === -1) throw new Error("No se encuentra el carrito seleccionado")

        carts.splice(cartIndex, 1);
        console.log(`Carrito ${id} eliminado`)

        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }

    // Método para eliminar un producto del carrito seleccionado.
    deleteProductFromCart = async(cid, pid) =>{
        //a desarrollar
    }

    // Método para actualizar la cantidad de un producto en un carrito.
    updateProductFromCart = async(cid, pid, quantity) =>{
        const carts = await this.getCarts()
        const cartById = await this.getCartById(cid)

        if (!cartById) throw new Error("No se encuentra el carrito seleccionado")

        const product = cartById.products.find(product => product.id === pid)

        if (!product) throw new Error("No se encuentra el producto seleccionado")

        product.quantity = quantity

        console.log(`Cantidad del producto ${pid} en el carrito ${cid} actualizada a ${quantity}`)
        await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 4))
    }

}