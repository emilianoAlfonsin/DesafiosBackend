import userModel from "../models/userModel.js"
import { hashPassword } from "../../utils.js"
import UserDTO from "../DTOs/user.dto.js"

export default class SessionService {
    
    // Registro de usuarios.
    async registerUser(userData) {
        try {
            const newUser = new userModel(userData)
            await newUser.save()
            return { status: "success", message: "Usuario registrado correctamente" }
        } catch (error) {
            console.error("Error al registrar usuario:", error.message)
            throw new Error("No se ha podido registrar el usuario")
        }
    }

    // Login de usuarios.
    async loginUser(user) {
        try {
            const userDTO = UserDTO.fromUser(user)
            return { status: "success", message: "Usuario logueado correctamente", payload: userDTO }
        } catch (error) {
            console.error("Error al loguear usuario:", error.message)
            throw new Error("Error de autenticación")
        }
    }

    // Restaurar el password de un usuario.
    async restorePassword(email, password) {
        try {
            if (!email || !password) throw new Error("Todos los campos son obligatorios")

            const user = await userModel.findOne({ email })
            if (!user) throw new Error("Error de autenticación")

            const newPassword = hashPassword(password)
            await userModel.updateOne({ email }, { password: newPassword })

            return { status: "success", message: "Contraseña restaurada correctamente" }
        } catch (error) {
            console.error("Error al restaurar la contraseña:", error.message)
            throw new Error("Error al restaurar la contraseña")
        }
    }

    // Obtener usuario actual.
    async getCurrentUser(session) {
        try {
            if (session.user) {
                const userDTO = UserDTO.fromUser(session.user)
                return { status: "success", message: "Usuario logueado correctamente", payload: userDTO }
            } else {
                throw new Error("Usuario no logueado")
            }
        } catch (error) {
            console.error("Error al obtener el usuario actual:", error.message)
            throw new Error(error.message)
        }
    }
}
