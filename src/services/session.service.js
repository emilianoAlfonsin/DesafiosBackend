import UserRepository from "../dao/repositories/user.repository.js" 
import UserDTO from "../dao/DTOs/user.dto.js" 
import SessionDTO from "../dao/DTOs/session.dto.js" 
import CartService from "./cart.service.js" 
import { hashPassword } from "../utils/utils.js" 
import { sendEmail } from "../config/nodemailer.config.js" 
import logger from "../utils/logger.js" 

export default class SessionService {
    async registerUser(userData) {
        try {
            const existingUser = await UserRepository.findUserByEmail(userData.email) 
            if (existingUser) {
                throw new Error("El usuario ya existe") 
            }
            const newUser = await UserRepository.createUser(userData) 
            
            const cartService = new CartService() 
            const cart = await cartService.createCart(newUser._id) 
            newUser.cart = cart._id 
            await newUser.save() 

            await sendEmail(newUser.email, "Registro exitoso", `Hola ${newUser.first_name}. Bienvenido a nuestra app!!`) 
            return UserDTO.fromUser(newUser) 
        } catch (error) {
            logger.error(`Error en el registro del usuario ${userData.email}, error: ${error}`) 
            throw new Error("Error al crear el usuario") 
        }
    }

    async loginUser(email, password) {
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) {
            throw new Error("Credenciales inválidas") 
        }
        return UserDTO.fromUser(user) 
    }

    async restorePassword(email, newPassword) {
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) throw new Error("El usuario no existe") 

        const hashedPassword = hashPassword(newPassword) 
        user.password = hashedPassword 
        await user.save() 

        await sendEmail(user.email, "Restauración de contraseña", "Tu contraseña ha sido reestablecida") 
        return UserDTO.fromUser(user) 
    }

    async getCurrentUser(session) {
        if (session.user) {
            return SessionDTO.fromUserDTO(session.user) 
        } else {
            throw new Error("Usuario no logueado") 
        }
    }

    async forgotPassword(email) {
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) throw new Error("El usuario no existe") 

        const token = await UserRepository.generateResetToken(user.email) 
        const resetLink = `${process.env.HOST}/api/session/reset-password/${token}` 

        await sendEmail(
            user.email,
            "Restablecimiento de contraseña",
            `Hola, ${user.first_name}. Por favor, haz clic en el siguiente enlace, o pégalo en tu navegador para completar el proceso:\n\n${resetLink}\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña no cambiará.\n`
        ) 

        logger.info("Email de restablecimiento de contraseña enviado") 
    }

    async resetPassword(token, newPassword) {
        const user = await UserRepository.findUserByResetToken(token)
        if (!user) throw new Error("El usuario no existe")

        logger.info(`Tipo de user: ${typeof user.save}`)
        const hashedPassword = hashPassword(newPassword)
        logger.info(`Tipo de user password hasheado: ${typeof user.save}`)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save()

        return UserDTO.fromUser(user) 
    }

    async verifyResetToken(token) {
        return UserRepository.verifyResetToken(token)
    }
    
    async changeUserRole(email, newRole) {
        const user = await UserRepository.findUserByEmail(email) 
        if (!user) throw new Error("El usuario no existe") 

        user.role = newRole 
        await user.save() 

        return UserDTO.fromUser(user) 
    }
}
