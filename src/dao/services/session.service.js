import userDao from "../DAOs/user.mongo.dao.js"
import UserDTO from "../DTOs/user.dto.js"
import SessionDTO from "../DTOs/session.dto.js"
import CartService from "./cart.service.js"

export default class SessionService {

     // Registro de usuarios.
    async registerUser(userData) {
        const newUser = await userDao.createUser(userData)
        
        // Crear carrito para el usuario
        const cartService = new CartService()
        const cart = await cartService.createCart(newUser._id)

        // Asignar el carrito al usuario
        newUser.cart = cart._id
        await newUser.save()

        return UserDTO.fromUser(newUser) // Devolver el DTO del usuario creado
    }

    // Login de usuarios.
    async loginUser(user) {
        const userDTO = UserDTO.fromUser(user)
        return userDTO // Devolver el DTO del usuario
    }

    // Restaurar el password de un usuario.
    async restorePassword(email, password) {
        if (!email || !password) throw new Error("Todos los campos son obligatorios")

        const user = await userDao.findUserByEmail(email)
        if (!user) throw new Error("Error de autenticación")

        await userDao.updatePasswordByEmail(email, password)

        return { email } // Devolver los datos necesarios
    }

    // Obtener usuario actual.
    async getCurrentUser(session) {
        if (session.user) {
            const sessionDTO = SessionDTO.fromUserDTO(session.user)
            return sessionDTO // Devolver el DTO de la sesión
        } else {
            throw new Error("Usuario no logueado")
        }
    }
}
