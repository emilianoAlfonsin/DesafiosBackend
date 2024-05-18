import ProductDTO from "../DTOs/product.dto.js"
import productsModel from "../models/productsModel.js"

export default class ProductsService {
    constructor() {
        this.model = productsModel
    }

    // Obtiene todos los productos de la base de datos y los pagina.
    async getProducts(params) {
        try {
            const {
                limit = 10,
                page = 1,
                sort,
                category,
                status
            } = params

            //Configuración de paginación.
            const options = {limit, page, lean : true}

            //Configuración de ordenamiento.
            if (sort && (sort === 'asc' || sort === 'desc')) {
                options.sort = { price: sort === 'asc' ? 1 : -1 }
            }

            //Configuración de filtro query.
            const query = {}
            category && (query.category = category)
            status && (query.status = status)

            //Consulta a la base de datos. Retorna un objeto con los productos y la información de paginación.
            const result = await this.model.paginate(query, options)

            // console.log(result)
            //Convertir los documentos de mongo en DTOs.
            const products = ProductDTO.fromProductDocuments(result.docs)
            console.log(products);


            // Retorna el objeto de paginación original con los productos convertidos a DTOs.
            return { ...result, docs: products} 

        } catch (error) {
            console.error(error)
            throw new Error('Error al obtener los productos')
        }
    }
    

    //Obtiene un producto por su id.
    async getProductById(id) {
        try {
            const product = await this.model.findById(id)
            //Si el producto no existe, devuelve un mensaje de error. Si existe, devuelve el producto.
            if (!product) throw new Error("Producto no encontrado")
            return ProductDTO.fromProductDocument(product)
        }
        catch (error) {
            console.error("Producto no encontrado",error)
        }
    }

    //Agregar un nuevo producto.
    async addProduct(product) {
        try {
            const newProduct = new this.model(product)
            const savedProduct = await newProduct.save()
            return ProductDTO.fromProductDocument(savedProduct)
        }
        catch (error) {
            console.error("Error al agregar producto", error)
        }
    }

    //Actualizar un producto.
    async updateProduct(id, product) {
        try {
            const updatedProduct = await this.model.findByIdAndUpdate(id, product, { new: true })//{ new: true } configuración para que retorne el documento actualizado.
            //Si no existe, devuelve un mensaje de error. Si existe, devuelve el producto actualizado.
            if (!updatedProduct) throw new Error("Producto no encontrado")
            return ProductDTO.fromProductDocument(updatedProduct) 
        }
        catch (error) {
            console.error("Error al actualizar producto", error)
        }
    }

    //Eliminar un producto.
    async deleteProductById(id) {
        try {
            const deletedProduct = await this.model.findByIdAndDelete(id)
            //Si no existe, devuelve un mensaje de error. Si existe, devuelve el producto eliminado.
            if (!deletedProduct) throw new Error("Producto no encontrado")
            return ProductDTO.fromProductDocument(deletedProduct)
        }
        catch (error) {
            console.error("Error al eliminar producto", error)
        }
    } 
}