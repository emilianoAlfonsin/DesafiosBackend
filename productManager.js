const fs = require('fs')

// Creación de la clase ProductManager
class ProductManager {

    constructor (path) { 
        this.path = path
        this.products = []
    }

    // Método para obtener todos los productos del array de productos
    getProducts = async() =>{
        const data = await fs.promises.readFile(this.path, 'utf-8')
        const products = data ? JSON.parse(data) : []
        return products
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
        
        // Agregando el producto al array de productos

        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))

        return console.log(`${product.title} agregado`)
    }


    // Método para obtener un producto del array de productos por su id
    getProductByID = (id) => {
        const prodById = this.products.find((prod) => prod.id == id)
        prodById 
        ? console.log(prodById) 
        : console.log("No se encuentra el producto seleccionado")
    }

    // Método para eliminar un producto del array de productos por su id
    deleteProductById = (id) => {
        const prodById = this.products.find((prod) => prod.id == id)
        prodById
        ? this.products.splice(prodById, 1) && console.log("Producto eliminado")
        : console.log("No se encuentra el producto seleccionado")
    }

}
// Testeando funcionamiento
async function run () {

const manager = new ProductManager('./products.json')

// Agregando productos

await manager.addProduct('Producto 10', 'Descripción del producto 10', 100, 'imagen1.jpg', 'ABC10', 10, true)

await manager.getProducts()
}

run()