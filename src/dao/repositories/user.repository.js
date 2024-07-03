import userModel from "../models/userModel.js" 
import { hashPassword, isValidObjectId, isValidPassword } from "../../utils/utils.js" 
import crypto from "crypto" 
import logger from "../../utils/logger.js"

class UserRepository {
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

    async generateResetToken(email) {
        const user = await userModel.findOne({ email }) 
        if (!user) {
            throw new Error("El usuario no existe") 
        }
        
        const resetToken = crypto.randomBytes(20).toString("hex") 
        const resetTokenExpiration = Date.now() + 3600000  // 1 hora
        user.resetPasswordToken = resetToken 
        user.resetPasswordExpires = resetTokenExpiration 
        await user.save() 
        return resetToken 
    }

    async findUserByResetToken(token) {
        const user = await userModel.findOne({ 
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        }) 
        logger.info(`Usuario por reset token: ${user}`)
        return user
    }

    async resetPassword(token, newPassword) {
        const user = await this.findUserByResetToken(token) 
        if (!user) throw new Error("El usuario no existe") 
        
        const hashedPassword = hashPassword(newPassword) 
        user.password = hashedPassword 
        user.resetPasswordToken = undefined 
        user.resetPasswordExpires = undefined 
        await user.save() 
    }

    async verifyResetToken(token) {
        const user = await this.findUserByResetToken(token)
        if (!user) throw new Error("El token de restablecimiento no es válido")
        return user
    }

}

export default new UserRepository() 
