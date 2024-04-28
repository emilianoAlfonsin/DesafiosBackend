import userModel from "../models/userModel"
import cartsModel from "../models/cartsModel"
import CartsManagerMongo from "./cartManager"

export default class UserManager {

    constructor() {
        console.log('Working userManager')
    }

    // Crear un usuario.
    async createUser(user) {
        try {
            const userCreated = await userModel.create(user)
            const cartsManager = new CartsManagerMongo()
            const cart = await cartsManager.createCart()
            await userCreated.updateOne({ $push: { carts: cart } })
            
            return userCreated
        } catch (error) {
            console.log(error)
        }
    }

    // Obtener un usuario.
    async getUser(email) {
        try {
            const user = await userModel.findOne({ email: email })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    // Obtener todos los usuarios.
    async getUsers() {
        try {
            const users = await userModel.find()
            return users
        } catch (error) {
            console.log(error)
        }
    }
}