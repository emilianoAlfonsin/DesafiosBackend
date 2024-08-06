import UserRepository from "../dao/repositories/user.repository.js" 
import UserDTO from "../dao/DTOs/user.dto.js" 
import SessionDTO from "../dao/DTOs/session.dto.js" 
import CartService from "./cart.service.js" 
import { hashPassword } from "../utils/utils.js" 
import { sendEmail } from "../config/nodemailer.config.js" 
import logger from "../utils/logger.js" 

export default class SessionService {
    // Registrar un nuevo usuario
    async registerUser(userData) {
        try {
            logger.info(`Registrando nuevo usuario con email: ${userData.email}`)
            const existingUser = await UserRepository.findUserByEmail(userData.email) 
            if (existingUser) {
                logger.error("El usuario ya existe")
                throw new Error("El usuario ya existe") 
            }
            const newUser = await UserRepository.createUser(userData) 
            
            const cartService = new CartService() 
            const cart = await cartService.createCart(newUser._id) 
            newUser.cart = cart._id 
            await newUser.save() 

            await sendEmail(newUser.email, "Registro exitoso", `Hola ${newUser.first_name}. Bienvenido a nuestra app!!`) 
            logger.info(`Usuario registrado exitosamente con email: ${newUser.email}`)
            return UserDTO.fromUser(newUser) 
        } catch (error) {
            logger.error(`Error en el registro del usuario ${userData.email}, error: ${error}`) 
            throw new Error("Error al crear el usuario") 
        }
    }

    // Iniciar sesión de usuario
    async loginUser(email, password) {
        logger.info(`Iniciando sesión para el usuario con email: ${email}`)
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) {
            logger.error("Credenciales inválidas")
            throw new Error("Credenciales inválidas") 
        }
        logger.info(`Usuario con email: ${email} ha iniciado sesión exitosamente`)
        return UserDTO.fromUser(user) 
    }

    // Restaurar contraseña de usuario
    async restorePassword(email, newPassword) {
        logger.info(`Restaurando contraseña para el usuario con email: ${email}`)
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) {
            logger.error("El usuario no existe")
            throw new Error("El usuario no existe") 
        }

        const hashedPassword = hashPassword(newPassword) 
        user.password = hashedPassword 
        await user.save() 

        await sendEmail(user.email, "Restauración de contraseña", "Tu contraseña ha sido reestablecida") 
        logger.info(`Contraseña restaurada exitosamente para el usuario con email: ${email}`)
        return UserDTO.fromUser(user) 
    }

    // Obtener el usuario actual de la sesión
    async getCurrentUser(session) {
        logger.info("Obteniendo usuario actual de la sesión")
        if (session.user) {
            return SessionDTO.fromUserDTO(session.user) 
        } else {
            logger.error("Usuario no logueado")
            throw new Error("Usuario no logueado") 
        }
    }

    // Solicitar restablecimiento de contraseña
    async forgotPassword(email) {
        logger.info(`Solicitando restablecimiento de contraseña para el usuario con email: ${email}`)
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) {
            logger.error("El usuario no existe")
            throw new Error("El usuario no existe") 
        }

        const token = await UserRepository.generateResetToken(user.email) 
        const resetLink = `${process.env.HOST}/api/session/reset-password/${token}` 

        await sendEmail(
            user.email,
            "Restablecimiento de contraseña",
            `Hola, ${user.first_name}. Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n${resetLink}\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña no cambiará.\n`
        ) 

        logger.info(`Email de restablecimiento de contraseña enviado a: ${email}`) 
    }

    // Restablecer contraseña usando el token
    async resetPassword(token, newPassword) {
        logger.info("Restableciendo contraseña usando el token")
        const user = await UserRepository.findUserByResetToken(token)
        if (!user) {
            logger.error("El usuario no existe")
            throw new Error("El usuario no existe")
        }

        logger.debug(`Tipo de user: ${typeof user.save}`)
        const hashedPassword = hashPassword(newPassword)
        logger.debug(`Tipo de user password hasheado: ${typeof user.save}`)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        logger.info(`Contraseña restablecida exitosamente para el usuario con email: ${user.email}`)
        return UserDTO.fromUser(user) 
    }

    // Verificar el token de restablecimiento de contraseña
    async verifyResetToken(token) {
        logger.info("Verificando token de restablecimiento de contraseña")
        return UserRepository.verifyResetToken(token)
    }
    
    // Cambiar el rol del usuario
    async changeUserRole(email, newRole) {
        logger.info(`Cambiando rol del usuario con email: ${email} a ${newRole}`)
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) {
            logger.error("El usuario no existe")
            throw new Error("El usuario no existe") 
        }

        user.role = newRole 
        await user.save() 

        logger.info(`Rol del usuario con email: ${email} cambiado a ${newRole} exitosamente`)
        return UserDTO.fromUser(user) 
    }
}
