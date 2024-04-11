import productsModel from "../models/productsModel.js"

export default class ProductsManagerMongo {
    constructor() {
        this.model = productsModel
    }

    // async getProducts() {
    //     try {
    //         return await this.model.find()
    //     }
    //     catch(error) {
    //         console.error(error)
    //     }
    // }

    async getProducts(params) {
        try {
            const {
                limit = 10,
                page = 1,
                sort,
                category,
                status
            } = params
    
            //Condiciones de paginación.
            const options = {limit, page, lean : true}

            //Condiciones de ordenamiento.
            if (sort && (sort === 'asc' || sort === 'desc')) {
                options.sort = { price: sort === 'asc' ? 1 : -1 }
            }
    
            //Condiciones de filtro query.
            const query = {}
            category && (query.category = category)
            status && (query.status = status)

            
            //Consulta a la base de datos. Retorna un objeto con los productos y la información de paginación.
            const result = await this.model.paginate(query, options)

            return result  //Devuelve los productos y la información de paginación.
        } catch (error) {
            console.error(error)
            throw new Error('Error al obtener los productos')
        }
    }
    

    async getProductById(id) {
        try {
            const product = await this.model.findById(id)
            //Si el producto no existe, devuelve un mensaje de error. Si existe, devuelve el producto.
            if (!product) throw new Error("Producto no encontrado")
            return product
        }
        catch (error) {
            console.error("Producto no encontrado",error)
        }
    }

    async addProduct(product) {
        try {
            const newProduct = new this.model(product)
            return await newProduct.save()  //Guarda el producto en la base de datos.
        }
        catch (error) {
            console.error("Error al agregar producto", error)
        }
    }

    async updateProduct(id, product) {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(id, product, { new: true })//{ new: true } configuración para que retorne el documento actualizado.
            //Si no existe, devuelve un mensaje de error. Si existe, devuelve el producto actualizado.
            if (!updatedProduct) throw new Error("Producto no encontrado")
            return updatedProduct  
        }
        catch (error) {
            console.error("Error al actualizar producto", error)
        }
    }

    async deleteProductById(id) {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(id)
            //Si no existe, devuelve un mensaje de error. Si existe, devuelve el producto eliminado.
            if (!deletedProduct) throw new Error("Producto no encontrado")
            return deletedProduct  //Devuelve el producto eliminado.
        }
        catch (error) {
            console.error("Error al eliminar producto", error)
        }
    } 
}