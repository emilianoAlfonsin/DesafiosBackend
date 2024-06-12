import userDao from "../DAOs/user.mongo.dao.js"
import UserDTO from "../DTOs/user.dto.js"
import SessionDTO from "../DTOs/session.dto.js"
import CartService from "./cart.service.js"
import { hashPassword } from "../../utils/utils.js"
import { sendEmail } from "../../config/nodemailer.config.js"


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

        const hashedPassword = hashPassword(password)
        user.password = hashedPassword
        await user.save()

        await sendEmail(user.email, "Restauración de contraseña", "Tu contraseña ha sido reestablecida")
        const userDTO = UserDTO.fromUser(user)
        return userDTO // Devolver el DTO del usuario
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

    // Enviar email de restablecimiento de contraseña.
    async forgotPassword(email) {
        const user = await userDao.findUserByEmail(email)
        if (!user) throw new Error("El usuario no existe")
        // Generar token de reset y guardarlo en la base de datos
        const token = userDao.generateResetToken(user.email)
        await userDao.saveResetToken(user.email, token)

        // Enviar email con enlace de restablecimiento de contraseña
        await sendEmail(
            user.email, 
            "Restablecimiento de contraseña", 
            `Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n` +
            `http://${process.env.HOST}/api/session/reset-password/${token}\n\n` +
            `Si no solicitaste esto, por favor ignora este correo y tu contraseña no cambiará.\n`)
    }

    // Verificar token de reset.
    async verifyResetToken(token) {
        const user = await userDao.findUserByResetToken(token)
        if (!user) throw new Error("El token no es válido")
        return user
    }

    async restorePassword(token, newPass){
        if (!token || !newPass) throw new Error("Todos los campos son obligatorios")
        // Verificar token de reset y obtener usuario correspondiente
        const user = await this.verifyResetToken(token)
        if (!user) throw new Error("Token inválido o expirado")
        // Verificar que la nueva contraseña no sea igual a la anterior
        const isPasswordEqual = await userDao.isPasswordEqual(user.email, newPass)
        if (isPasswordEqual) throw new Error("La nueva contraseña no puede ser igual a la anterior")
        // Hashear la nueva contraseña antes de guardarla en la base de datos
        const hashedPassword = hashPassword(newPass)
        user.password = hashedPassword
        await user.save()

        await sendEmail(user.email, "Restablecimiento de contraseña", "Tu contraseña ha sido reestablecida")

        return UserDTO.fromUser(user)
    }
}
