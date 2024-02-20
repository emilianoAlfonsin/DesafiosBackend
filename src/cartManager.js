import fs from 'fs';

export default class CartManager {

    cart = new Array()

    constructor(path) {
        this.path = path
        if (fs.existsSync(path)) {
            this.products = JSON.parse(fs.readFileSync(path, 'utf-8'))
            console.log("Archivo existente")
        } else {
            fs.writeFileSync(path, '[]')
            console.log("Archivo creado")
        }
    }   

    // Método para obtener todos los carritos del array de carritos.
    getCarts = async() =>{
        const carts = await fs.promises.readFile(this.path, 'utf-8')
        return JSON.parse(carts)
    }

    // Método para obtener un carrito por su id.
    getCartById = async(id) =>{
        const carts = await this.getCarts()
        const cartById = carts.find(cart => cart.id === id)
        cartById
        ? console.log(cartById)
        : console.log("No se encuentra el carrito seleccionado")

        return cartById
    }

    // Método para agregar un carrito al array de carritos.
    addCart = async() =>{
        const carts = await this.getCarts()
        const cartId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1
        const newCart = {id: cartId, products: []}
        carts.push(newCart)
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
        return newCart
    }

    // Método para agregar un producto al carrito seleccionado desde products.json
    addProduct = async(cid, pid) =>{ 
        // busqueda de carrito por id, si no lo encuentra lo crea
        const cart = await this.getCartById(cid) || await this.addCart()

        // busqueda de productos por id, verificación de que existe en products.json
        const products = await fs.promises.readFile('./products.json', 'utf-8')
        const productById = JSON.parse(products).find(product => product.id === pid)
        // busqueda de producto por id en el carrito
        const productInCart = cart.products.find(product => product.id === pid) 
        // si existe el producto en products.json procede a agregarlo, sino da mensaje de error
        if (productById) {
            // si existe el producto, le suma 1 a la cantidad, si no existe lo crea.
            productInCart
            ? productInCart.quantity++
            : cart.products.push({id: pid, quantity: 1})
            await fs.promises.writeFile(this.path, JSON.stringify(cart))
        }else {
            console.log("No se encuentra el producto seleccionado")
        }
        
        return cart
    }

    // Método para eliminar un carrito del array de carritos.
    deleteCartById = async(id) =>{
        const carts = await this.getCarts()
        const cartById = await this.getCartById(id)
        cartById
        ? carts.splice(carts.indexOf(cartById), 1) && console.log(`Carrito ${cartById.id} eliminado`)
        : console.log("No se encuentra el carrito seleccionado")
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }

    // Método para eliminar un producto del carrito seleccionado.
    deleteProductFromCart = async(cid, pid) =>{
        const carts = await this.getCarts()
        const cartById = await this.getCartById(cid)
        cartById
        ? cartById.products.splice(cartById.products.findIndex(product => product.id === pid), 1) && console.log(`${pid} eliminado`)
        : console.log("No se encuentra el carrito seleccionado")
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }

    // Método para actualizar la cantidad de un producto en un carrito.
    updateProductFromCart = async(cid, pid, quantity) =>{
        const carts = await this.getCarts()
        const cartById = await this.getCartById(cid)
        cartById
        ? cartById.products.find(product => product.id === pid).quantity = quantity
        : console.log("No se encuentra el carrito seleccionado")
        await fs.promises.writeFile(this.path, JSON.stringify(carts))
    }

}