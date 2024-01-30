// Creación de la clase ProductManager
class ProductManager {

    constructor () { // no se si debería colocar algo como parametro
        this.products = []
    }

    // Método para agregar productos al array de productos
    addProduct = (title, description, price, tumbnail, code, stock) => {
        if (!title || !description || !price || !tumbnail || !code || !stock) {
            return console.log("Por favor verifique que todos los campos del producto se encuentren completos")
        }

        
        // Cálculo del id del producto para que no se repita en el array de productos
        const productId = this.products.length > 0
        ? this.products[this.products.length - 1].id + 1 // Accediendo al id del ultimo elemento del array
        : 1;
        
        const product = {
            id : productId,
            title,
            description,
            price,
            tumbnail,
            code,
            stock
        }
        
        // Validación de que el código del producto no se repita en el array de productos
        const codeControl = this.products.find((prod) => prod.code === code )
        if (codeControl) {
        return console.log("El código del producto ya existe")
        } 
        
        // Agregando el producto al array de productos
        this.products.push(product)

        return product
    }

    // Método para obtener todos los productos del array de productos
    getProducts(){
        this.products.length === 0
        ? console.log("No hay productos cargados")
        : console.log(this.products)  // Imprimiendo el array de productos en consola
    }  

    // Método para obtener un producto del array de productos por su id
    getProductByID(id){
        const prodById = this.products.find((prod) => prod.id == id)
        prodById 
        ? console.log(prodById) 
        : console.log("No se encuentra el producto seleccionado")
    }

    // Método para eliminar un producto del array de productos por su id
    deleteProductById(id){
        const prodById = this.products.find((prod) => prod.id == id)
        prodById
        ? this.products.splice(prodById, 1) && console.log("Producto eliminado")
        : console.log("No se encuentra el producto seleccionado")
    }
}

// Testeando funcionamiento
const manager = new ProductManager()
manager.getProducts()
manager.addProduct("producto prueba1", "Este es un producto prueba", 200, "Sin imágen", "abc1", 25)
manager.addProduct("producto prueba2", "Este es un producto prueba", 300, "Sin imágen", "abc2", 25)
manager.addProduct("producto prueba3", "Este es un producto prueba", 400, "Sin imágen", "abc3", 25)
manager.getProducts()
manager.addProduct("producto prueba3", "Este es un producto prueba", 400, "Sin imágen", "abc3", 25)
manager.deleteProductById(1)
manager.getProducts()
manager.getProductByID(2)