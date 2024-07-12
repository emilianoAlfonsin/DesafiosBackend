import UserService from "../services/user.service.js"
import logger from "../utils/logger.js"

export default class UserController {
    async uploadDocuments(req, res) {
        try {
            const userId = req.params.uid
            const files = req.files
            const user = await UserService.uploadDocuments(userId, files)

            res.status(200).json({
                status: "success",
                message: "Documentos subidos correctamente",
                user: user
            })
        } catch (error) {
            logger.error(error) 
            res.status(500).json({
                status: "failure",
                message: "Error al subir documentos"
            })
        }
    }

    async updateToPremium(req, res) {
        try {
            const userId = req.params.uid
            const user = await UserService.updateToPremium(userId)

            res.status(200).json({
                status: "success",
                message: "Usuario actualizado a premium correctamente",
                user: user
            })
        } catch (error) {
            logger.error(error)
            res.status(500).json({
                status: "failure",
                message: "Error al actualizar usuario a premium"
            })
        }
    }
}