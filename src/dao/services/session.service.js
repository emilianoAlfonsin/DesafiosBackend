import userDao from "../DAOs/user.mongo.dao.js"
import UserDTO from "../DTOs/user.dto.js"
import SessionDTO from "../DTOs/session.dto.js"
import CartService from "./cart.service.js"
import { hashPassword } from "../../utils/utils.js"
import { sendEmail } from "../../config/nodemailer.config.js"
import logger from "../../utils/logger.js"


export default class SessionService {

     // Registro de usuarios.
    async registerUser(userData) {
        try {
            const existingUser = await userDao.findUserByEmail(userData.email)
            if (existingUser) {
                logger.error("El usuario ya existe")
                throw new Error("El usuario ya existe")
            }
            const newUser = await userDao.createUser(userData)
            logger.info(`Nuevo usuario creado: ${newUser.email}`)
            
            // Crear carrito para el usuario
            const cartService = new CartService()
            const cart = await cartService.createCart(newUser._id)
            logger.info(`Carrito creado: ${cart._id}`)
    
            // Asignar el carrito al usuario
            newUser.cart = cart._id
            await newUser.save()
            logger.info(`Carrito asignado al usuario: ${newUser.email}`)
    
            return UserDTO.fromUser(newUser) // Devolver el DTO del usuario creado
        } catch (error) {
            logger.error(`Error en el registro del usuario ${userData.email}, error: ${error}`)
            throw new Error("Error al crear el usuario")
        }
    }

    // Login de usuarios.
    async loginUser(user) {
        const userDTO = UserDTO.fromUser(user)
        return userDTO // Devolver el DTO del usuario
    }

    // Restaurar el password de un usuario.
    async restorePassword(email, password) {
        if (!email || !password) throw new Error("Todos los campos son obligatorios")

        // Verificar que el usuario exista
        const user = await userDao.findUserByEmail(email)
        if (!user) throw new Error("Error de autenticación")

        // Verificar que la nueva contraseña no sea igual a la anterior
        const isPasswordEqual = await userDao.isPasswordEqual(user.email, newPass)
        if (isPasswordEqual) throw new Error("La nueva contraseña no puede ser igual a la anterior")

        // Hashar la nueva contraseña
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
            logger.info(`Email: ${email}`)
            if (!email) throw new Error("Todos los campos son obligatorios")
            // Verificar que el usuario exista
            const user = await userDao.findUserByEmail(email)
            if (!user) throw new Error("El usuario no existe")
            // Generar token de reset y guardarlo en la base de datos
            logger.info("email encontrado", user.email)
            const token = await userDao.generateResetToken(user.email)

            logger.info(`Token de restablecimiento de contraseña guardado`)

            const resetLink = `${process.env.HOST}/api/session/reset-password/${token}`

            // Enviar email con enlace de restablecimiento de contraseña
            await sendEmail(
                user.email,
                "Restablecimiento de contraseña",
                `Hola, ${user.first_name}. Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n` +
                `${resetLink}\n\n`+
                `Si no solicitaste esto, por favor ignora este correo y tu contraseña no cambiará.\n`
            )
            logger.info("Email de restablecimiento de contraseña enviado")
    }

    // Verificar token de reset.
    async verifyResetToken(token) {
        const user = await userDao.findUserByResetToken(token)
        if (!user) throw new Error("El token no es válido")
        return user
    }

    // Restablecer contraseña.
    async resetPassword(token, newPass){
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
