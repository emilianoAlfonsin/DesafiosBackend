import userModel from "../models/userModel.js"
import { hashPassword } from "../../utils.js"
import UserDTO from "../DTOs/user.dto.js"
import SessionDTO from "../DTOs/session.dto.js"

export default class SessionService {
    
    // Registro de usuarios.
    async registerUser(userData) {
        const newUser = new userModel(userData);
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

        const user = await userModel.findOne({ email })
        if (!user) throw new Error("Error de autenticación")

        const newPassword = hashPassword(password)
        await userModel.updateOne({ email }, { password: newPassword })

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