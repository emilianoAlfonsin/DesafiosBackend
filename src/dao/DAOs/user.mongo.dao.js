import userModel from "../models/userModel.js"
import { hashPassword, isValidObjectId } from "../../utils.js"

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
}

export default new UserMongoDAO()
