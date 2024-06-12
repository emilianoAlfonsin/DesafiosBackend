import userModel from "../models/userModel.js"
import { hashPassword, isValidObjectId, isValidPassword } from "../../utils/utils.js"
import crypto from "crypto"

class UserMongoDAO {
    async createUser(userData) {
        const newUser = new userModel(userData)
        return await newUser.save()
    }

    async findUserByEmail(email) {
        return await userModel.findOne({ email })
    }

    async findUserById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del usuario no es válido")
        return await userModel.findById(id)
    }

    async updatePasswordByEmail(email, newPassword) {
        const hashedPassword = hashPassword(newPassword)
        return await userModel.updateOne({ email }, { password: hashedPassword })
    }

    async generatePasswordByEmail(email, newPassword) {
        const hashedPassword = hashPassword(newPassword)
        return await userModel.updateOne({ email }, { password: hashedPassword })
    }

    async generateResetToken(email) {
        const user = await userModel.findOne({ email })
        if (!user) throw new Error("El usuario no existe")
        // Generar un token de reset
        const resetToken = crypto.randomBytes(20).toString("hex")
        const resetTokenExpiration = Date.now() + 3600000 // 1 hora
        // Guardar el token en la base de datos
        user.resetToken = resetToken
        user.resetTokenExpiration = resetTokenExpiration
        // Guardar el usuario
        await user.save()
        return resetToken
    }

    // Buscar un usuario por su token de reset
    async findUserByResetToken(token) {
        return await userModel.findOne({ 
            resetPasswordToken: token,
            resetPasswordTokenExpiration: { $gt: Date.now()} // (gt: mayor que)
        })
    }

    async resetPassword(token) {
        const user = await this.findUserByResetToken(token)
        if (!user) throw new Error("El usuario no existe")
        // Actualizar la contraseña del usuario
        const hashedPassword = hashPassword(newPassword)
        user.password = hashedPassword
        user.resetPasswordToken = undefined
        user.resetPasswordTokenExpiration = undefined
        await user.save()
    }

    async isPasswordEqual(email, password) {
        const user = await userModel.findOne({ email })
        if (!user) throw new Error("El usuario no existe")
        return isValidPassword(password, user.password)
    }
}

export default new UserMongoDAO()
