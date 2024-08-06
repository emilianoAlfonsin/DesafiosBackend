import { log } from "winston"
import UserDTO from "../dao/DTOs/user.dto.js"
import userRepository from "../dao/repositories/user.repository.js"
import logger from "../utils/logger.js"

export default class UserService {
    // Método para subir documentos de un usuario
    async uploadDocuments(userId, files) {
        try {
            // Buscar usuario por ID
            const user = await userRepository.findUserById(userId)
            if (!user) {
                throw new Error("Usuario no encontrado")
            }
            // Mapear archivos a documentos
            const documents = files.map((file) => ({
                name: file.originalname,
                reference: file.path
            }))
            // Agregar documentos al usuario
            user.documents.push(...documents)
            await user.save()
            // Crear y retornar DTO del usuario
            const userDTO = new UserDTO(user)
            return userDTO
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error cargando los archivos: ${error}`)
            throw new Error("Error cargando los documentos")
        }
    }

    // Método para actualizar el rol de un usuario a premium
    async updateToPremium(userId) {
        try {
            // Buscar usuario por ID
            const user = await userRepository.findUserById(userId)
            if (!user) {
                logger.error("Usuario no encontrado")
                throw new Error("Usuario no encontrado")
            }
            // Verificar si el usuario ya es premium
            if (user.role === "premium") {
                logger.error("El usuario ya es premium")
                throw new Error("El usuario ya es premium")
            }
            // Documentos requeridos para ser premium
            const requiredDocuments = ["Identificación", "Comprobante de domicilio", "Comprobante de estado de cuenta"]
            // Documentos subidos por el usuario
            const uploadedDocuments = user.documents.map(doc => doc.name)
            // Filtrar documentos faltantes
            const missingDocuments = requiredDocuments.filter((doc) => !uploadedDocuments.includes(doc))
            logger.warn(`Faltan los siguientes documentos: ${missingDocuments.join(", ")}`)
            
            // Si faltan documentos, lanzar excepción
            if (missingDocuments.length > 0) {
                logger.error(`Faltan los siguientes documentos: ${missingDocuments.join(", ")}`)
                throw new Error(`Faltan los siguientes documentos: ${missingDocuments.join(", ")}`)
            }

            // Actualizar rol del usuario a premium
            user.role = "premium"
            await user.save()
            // Crear y retornar DTO del usuario
            const userDTO = new UserDTO(user)
            return userDTO
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error actualizando a premium, ${error}`)
            throw new Error("Error actualizando a premium")
        }
    }

    // Método para actualizar el rol de un usuario
    async updateUserRole(userId, newRole) {
        try {
            // Actualizar rol del usuario
            const user = await userRepository.updateUserRole(userId, newRole)
            if (!user) {
                logger.error("Usuario no encontrado")
                throw new Error("Usuario no encontrado")
            }
            // Crear y retornar DTO del usuario
            const userDTO = new UserDTO(user)
            return userDTO
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error actualizando el rol del usuario: ${error}`)
            throw new Error("Error actualizando el rol del usuario")
        }
    }

    // Método para eliminar un usuario
    async deleteUser(userId) {
        try {
            // Eliminar usuario por ID
            await userRepository.deleteUserById(userId)
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error eliminando usuario: ${error}`)
            throw new Error("Error eliminando usuario")
        }
    }

    // Método para obtener todos los usuarios
    async getAllUsers(query, fields) {
        try {
            // Obtener todos los usuarios
            const users = await userRepository.getAllUsers(query, fields)
            // Mapear usuarios a DTOs
            const usersDTO = users.map(user => new UserDTO(user))
            return usersDTO
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error obteniendo los usuarios: ${error}`)
            throw new Error("Error obteniendo los usuarios")
        }
    }

    // Metodo para borrado de usuarios inactivos
    async deleteInactiveUsers() {
        try {
            const inactiveUsers = await userRepository.getInactiveUsers(30); // 30 minutos para pruebas
            // Si hay usuarios inactivos enviar correo y eliminar
            for (const user of inactiveUsers) {
                await sendEmail(user.email, "Cuenta eliminada por inactividad", "Tu cuenta ha sido eliminada por inactividad.");
                logger.info(`Usuario inactivo eliminado: ${user.email}`);
                await userRepository.deleteUserById(user._id);
            }
        } catch (error) {
            // Loguear error y lanzar excepción
            logger.error(`Error eliminando usuarios inactivos: ${error}`)
            throw new Error("Error eliminando usuarios inactivos")
        }
    }
}