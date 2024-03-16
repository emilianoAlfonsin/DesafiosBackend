import fs from 'fs'

// Creación de la clase ProductManager.
export default class ProductManager {

    constructor (path) { 
        this.products = []
        this.path = path
        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, JSON.stringify(this.products, null, 4))
            console.log("Archivo creado")
        }
    }

    // Método para obtener todos los productos del array de productos.
    getProducts = async() =>{
        const products = await fs.promises.readFile(this.path, 'utf-8')
        // console.log("Manager",products)
        return JSON.parse(products)
    }
    
    // Método para obtener un producto del array de productos por su Id.
    getProductById = async (id) => {
        const products = await this.getProducts()
        const prodId = parseInt(id)
        const prodById = products.find((prod) => prod.id === prodId)

        if (!prodById) throw new Error("No se encuentra el producto seleccionado")
        return prodById
    }

    // Método para agregar productos al array de productos.
    addProduct = async (title, description, price, thumbnail, code, stock, status) => {
        if (!title || !description || !price || !thumbnail || !code || !stock || !status) {
            throw new Error("Por favor, verifica que todos los campos del producto estén completos")
        }

        const products = await this.getProducts()

        // Verificar si el código del producto ya existe en el array de productos.
        const codeExists = products.some(prod => prod.code === code)
        if (codeExists) throw new Error("El código del producto ya existe")

        // Cálculo del id del producto para que no se repita en el array de productos.
        const productId = products.length > 0
            ? products[products.length - 1].id + 1 // Accediendo al id del último elemento del array.
            : 1

        const product = {
            id: productId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status
        }

        // Agregar el producto al array de productos y sobreescribir el JSON.
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))

        console.log(`${product.title} agregado`)
        return product
    }

    // Método para actualizar un producto del array de productos por su id y sobreescribiendo el JSON con el nuevo producto modificado.
    updateProduct = async (id, updatedFields ) => {
        const products = await this.getProducts()
        const prodId = parseInt(id)
        const productIndex= products.findIndex(prod => prod.id === prodId)

        if (productIndex === -1) throw new Error("Producto no encontrado")

        const updatedProduct = { ...products[productIndex], ...updatedFields }
        products[productIndex] = updatedProduct

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))

        console.log(`${updatedProduct.title} actualizado`)
        return updatedProduct
    }

    // Método para eliminar un producto del array de productos por su Id.
    deleteProductById = async (id) => {
        const products = await this.getProducts()
        const prodId = parseInt(id)
        const productIndex = products.findIndex(prod => prod.id === prodId)

        if (productIndex === -1) throw new Error("Producto no encontrado")

        products.splice(productIndex, 1)

        await fs.promises.writeFile(this.path, JSON.stringify(products, null, 4))

        console.log(`Producto ${prodId} eliminado`)
    }   
}



// Testeando funcionamiento
// async function test() {
    // const manager = new ProductManager('./products.json')
    // await manager.addProduct('Producto 1', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC1', 10, true)
    // await manager.addProduct('Producto 2', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC2', 10, true)
    // await manager.getProducts()
    // await manager.addProduct('Producto 3', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC3', 10, true)
    // await manager.addProduct('Producto 4', 'Descripción del producto 15', 100, 'imagen1.jpg', 'ABC4', 10, true)
    // await manager.getProductById(1)
    // await manager.deleteProductById(2)
    // await manager.getProductById(2)
    // await manager.updateProduct(1, {title : 'Producto 1 modificado'})
// }

// test()

