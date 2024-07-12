import UserDTO from "../dao/DTOs/user.dto.js"
import userRepository from "../dao/repositories/user.repository.js"
import logger from "../utils/logger.js"

export default class UserService {
    async uploadDocuments(userId, files) {
        try {
            const user = await userRepository.getUserById(userId)
            if (!user) {
                throw new Error("Usuario no encontrado")
            }
            const documents = []
            for (const file of files) {
                documents.push(file.filename)
            }
            user.documents = documents
            await user.save()
            const userDTO = new UserDTO(user)
            return userDTO
        } catch (error) {
            logger.error(error)
            throw new Error("Error cargando los documentos")
        }
    }

    async updateToPremium(userId) {
        try {
            const user = await userRepository.getUserById(userId)
            if (!user) {
                throw new Error("Usuario no encontrado")
            }
            user.role = "premium"
            await user.save()
            const userDTO = new UserDTO(user)
            return userDTO
        } catch (error) {
            logger.error(error)
            throw new Error("Error actualizando a premium")
        }
    }
}