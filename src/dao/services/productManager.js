import { productsModel } from "../models/productsModel"

export default class ProductsManagerDao {
    constructor() {
        this.model = productsModel
    }

    async getProducts() {
        try {
            return await this.model.find()
        }
        catch(error) {
            console.error(error)
        }
    }

    async getProductById(id) {
        try {
            return await this.model.findById(id)
        }
        catch (error) {
            console.error("Producto no encontrado",error)
        }
    }

    async addProduct(product) {
        try {
            return await this.model.create(product)
        }
        catch (error) {
            console.error("Error al agregar producto", error)
        }
    }

    async updateProduct(id, product) {
        try {
            return await this.model.findByIdAndUpdate(id, product)
        }
        catch (error) {
            console.error("Error al actualizar producto", error)
        }
    }

    async deleteProductById(id) {
        try {
            return await this.model.findByIdAndDelete(id)
        }
        catch (error) {
            console.error("Error al eliminar producto", error)
        }
    } 
}