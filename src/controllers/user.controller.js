import UserService from "../services/user.service.js";
import logger from "../utils/logger.js";
import { handleSuccess, handleError } from "../utils/responseHandler.js";

const userService = new UserService();

export default class UserController {

    // Método para obtener todos los usuarios
    async getAllUsers(req, res) {
        try {
            logger.info("Iniciando la obtención de todos los usuarios");
            const users = await userService.getAllUsers();
            logger.info("Usuarios obtenidos correctamente");
            return handleSuccess(res, 200, "Usuarios obtenidos correctamente", users);
        } catch (error) {
            logger.error("Error al obtener los usuarios", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al obtener los usuarios", error);
        }
    }

    // Método para subir documentos de un usuario
    async uploadDocuments(req, res) {
        try {
            logger.info(`Iniciando la subida de documentos para el usuario con id: ${req.params.uid}`);
            const userId = req.params.uid;
            const files = req.files;
            if (!files || files.length === 0) {
                return handleError(res, 400, "BAD_REQUEST", "No se proporcionaron documentos", new Error("No se proporcionaron documentos"));
            }
            const user = await userService.uploadDocuments(userId, files);
            logger.info("Documentos subidos correctamente");
            return handleSuccess(res, 200, "Documentos subidos correctamente", user);
        } catch (error) {
            logger.error("Error al subir los documentos", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al subir los documentos", error);
        }
    }

    // Método para actualizar el rol de un usuario a premium
    async updateToPremium(req, res) {
        try {
            logger.info(`Iniciando la actualización del usuario con id: ${req.params.uid} a premium`);
            const userId = req.params.uid;
            const user = await userService.updateToPremium(userId);
            logger.info("Usuario actualizado a premium correctamente");
            return handleSuccess(res, 200, "Usuario actualizado a premium correctamente", user);
        } catch (error) {
            logger.error("Error al actualizar usuario a premium", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al actualizar usuario a premium", error);
        }
    }

    // Método para actualizar el rol de un usuario
    async updateUserRole(req, res) {
        try {
            logger.info(`Iniciando la actualización del rol del usuario con id: ${req.params.uid}`);
            const { uid }= req.params;
            const { role } = req.body;
            const user = await userService.updateUserRole(uid, role);
            logger.info("Rol de usuario actualizado correctamente");
            return handleSuccess(res, 200, "Rol de usuario actualizado correctamente", user);
        } catch (error) {
            logger.error("Error al actualizar el rol de usuario", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al actualizar el rol de usuario", error);
        }
    }

    // Método para eliminar un usuario
    async deleteUser(req, res) {
        try {
            logger.info(`Iniciando la eliminación del usuario con id: ${req.params.uid}`);
            const userId = req.params.uid;
            await userService.deleteUser(userId);
            logger.info("Usuario eliminado correctamente");
            return handleSuccess(res, 200, "Usuario eliminado correctamente");
        } catch (error) {
            logger.error("Error al eliminar usuario", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al eliminar usuario", error);
        }
    }

    // Método para eliminar usuarios inactivos
    async deleteInactiveUsers(req, res) {
        try {
            logger.info("Iniciando la eliminación de usuarios inactivos");
            const inactiveUsers = await userService.deleteInactiveUsers();
            logger.info("Usuarios inactivos eliminados correctamente");
            return handleSuccess(res, 200, "Usuarios inactivos eliminados correctamente", inactiveUsers);
        } catch (error) {
            logger.error("Error al eliminar usuarios inactivos", error);
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al eliminar usuarios inactivos", error);
        }
    }
}