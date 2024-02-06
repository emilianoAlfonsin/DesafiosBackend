const fs = require('fs')

// 1) Al instanciar la clase, que chequee si existe el archivo (llamemoslo productos.json) pueden usar fsExistsSync
// A) Si no existe, lo crea, junto con un array vacio
// B) Si existe, lee lo que hay en el archivo, lo parsea a json y lo graba en el array dentro de la clase. (Estas tres cosas pasan en el constructor)

// Creación de la clase ProductManager
class ProductManager {

    products = new Array()

    constructor (path) { 
        this.path = path
        if (fs.existsSync(path)) {
            this.products = JSON.parse(fs.readFileSync(path, 'utf-8'))
            console.log("Archivo existente")
        } else {
            fs.writeFileSync(path, '[]')
            console.log("Archivo creado")
        }
    }

    // Método para obtener todos los productos del array de productos
    getProducts = async() =>{
        const products = await fs.promises.readFile(this.path, 'utf-8')
        // console.log(products)
        return JSON.parse(products)
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

        return prodById
    }

    // Método para eliminar un producto del array de productos por su id
    deleteProductById = async (id) => {
        const products = await this.getProducts()
        const prodById = products.find((prod) => prod.id === id)

        prodById
        ? products.splice(products.indexOf(prodById), 1) && console.log(`${prodById.title} eliminado`) 
        : console.log("No se encuentra el producto seleccionado")

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    // Método para actualizar un producto del array de productos por su id y sobreescribiendo el JSON con el nuevo producto modificado.
    updateProduct = async (id, pair ) => {
        const products = await this.getProducts()
        const prodById = products.find((prod) => prod.id === id)
        
        prodById
        ? Object.assign(prodById, pair) && console.log(`${prodById.title} actualizado`)
        : console.log("No se encuentra el producto seleccionado")

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

}
// Testeando funcionamiento
async function test() {
    const manager = new ProductManager('./products.json')
    // await manager.addProduct('Producto 1', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC1', 10, true)
    // await manager.addProduct('Producto 2', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC2', 10, true)
    // await manager.getProducts()
    // await manager.addProduct('Producto 3', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC3', 10, true)
    // await manager.addProduct('Producto 4', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC4', 10, true)
    // await manager.getProductByID(1)
    // await manager.deleteProductById(2)
    // await manager.getProductByID(2)
    // await manager.updateProduct(1, {title : 'Producto 1 modificado'})
}

test()
