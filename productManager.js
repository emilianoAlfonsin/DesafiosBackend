const fs = require('fs')

// Creación de la clase ProductManager
class ProductManager {

    constructor (path) { 
        this.path = path
    }

    // Método para obtener todos los productos del array de productos
    getProducts = async() =>{
        try{
            const data = await fs.promises.readFile(this.path, 'utf-8')
            const products = JSON.parse(data)
            return products
        }
        catch(error){
            await fs.promises.writeFile(this.path, '[]')
        }
    }  

    // Método para agregar productos al array de productos
    addProduct = async (title, description, price, tumbnail, code, stock, offer) => {
        if (!title || !description || !price || !tumbnail || !code || !stock || !offer) {
            return console.log("Por favor verifique que todos los campos del producto se encuentren completos")
        }

        const products = await this.getProducts()

        // Cálculo del id del producto para que no se repita en el array de productos
        const productId = products.length > 0
        ? products[products.length - 1].id + 1 // Accediendo al id del ultimo elemento del array
        : 1


        const product = {
            id : productId,
            title,
            description,
            price,
            tumbnail,
            code,
            stock,
            offer
        }
        
        // Validación de que el código del producto no se repita en el array de productos
        const codeControl = products.find((prod) => prod.code === code )
        if (codeControl) {
        return console.log("El código del producto ya existe")
        } 
        
        // Agregando el producto al array de productos y sobreescribiendo el JSON
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))

        return console.log(`${product.title} agregado`)
    }


    // Método para obtener un producto del array de productos por su id
    getProductByID = async (id) => {
        const products = await this.getProducts()
        const prodById = products.find((prod) => prod.id == id)
        prodById 
        ? console.log(prodById) 
        : console.log("No se encuentra el producto seleccionado")
    }

    // Método para eliminar un producto del array de productos por su id
    deleteProductById = async (id) => {
        const products = await this.getProducts()
        const prodById = products.find((prod) => prod.id === id)
        prodById
        ? products.splice(prodById, 1) && console.log(`${prodById.title} eliminado`)
        : console.log("No se encuentra el producto seleccionado")

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    updateProduct = async (id, {key : value}) => {
        const products = await this.getProducts()
        const prodById = products.find((prod) => prod.id == id)

        prodById


        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

}
// Testeando funcionamiento
async function test() {
    const manager = new ProductManager('./products.json')
    await manager.getProducts()
    await manager.addProduct('Producto 1', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC1', 10, true)
    await manager.addProduct('Producto 2', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC2', 10, true)
    await manager.addProduct('Producto 3', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC3', 10, true)
    await manager.addProduct('Producto 4', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC4', 10, true)

    await manager.getProductByID(1)
    await manager.deleteProductById(2)
    // await manager.updateProduct(2, {title : 'Producto 2 modificado'})
    await manager.getProductByID(2)
}

test()
