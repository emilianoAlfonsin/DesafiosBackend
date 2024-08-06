import userModel from '../models/userModel.js';
import crypto from 'crypto';
import { isValidObjectId } from 'mongoose';
import { hashPassword } from '../../utils/utils.js';
import logger from '../../utils/logger.js';

class UserRepository {
    // Crear un nuevo usuario
    async createUser(userData) {
        try {
            const newUser = new userModel(userData);
            return await newUser.save();
        } catch (error) {
            logger.error("Error al crear el usuario:", error);
            throw error;
        }
    }

    // Encontrar todos los usuarios
    async getAllUsers() {
        try {
            return await userModel.find({}, "first_name last_name email role");
        } catch (error) {
            logger.error("Error al encontrar todos los usuarios:", error);
            throw error;
        }
    }

    // Encontrar usuario por email
    async findUserByEmail(email) {
        try {
            return await userModel.findOne({ email });
        } catch (error) {
            logger.error(`Error al encontrar el usuario con email ${email}:`, error);
            throw error;
        }
    }

    // Encontrar usuario por ID
    async findUserById(id) {
        try {
            if (!isValidObjectId(id)) throw new Error("El ID del usuario no es válido");
            return await userModel.findById(id);
        } catch (error) {
            logger.error(`Error al encontrar el usuario con ID ${id}:`, error);
            throw error;
        }
    }

    // Actualizar contraseña por email
    async updatePasswordByEmail(email, newPassword) {
        try {
            const hashedPassword = hashPassword(newPassword);
            return await userModel.updateOne({ email }, { password: hashedPassword });
        } catch (error) {
            logger.error(`Error al actualizar la contraseña para el email ${email}:`, error);
            throw error;
        }
    }

    // Generar token de reseteo de contraseña
    async generateResetToken(email) {
        try {
            const user = await userModel.findOne({ email });
            if (!user) throw new Error("El usuario no existe");

            const resetToken = crypto.randomBytes(20).toString("hex");
            const resetTokenExpiration = Date.now() + 3600000; // 1 hora
            user.resetPasswordToken = resetToken;
            user.resetPasswordExpires = resetTokenExpiration;
            await user.save();
            return resetToken;
        } catch (error) {
            logger.error(`Error al generar el token de reseteo para el email ${email}:`, error);
            throw error;
        }
    }

    // Encontrar usuario por token de reseteo
    async findUserByResetToken(token) {
        try {
            const user = await userModel.findOne({
                resetPasswordToken: token,
                resetPasswordExpires: { $gt: Date.now() }
            });
            logger.info(`Usuario encontrado por reset token: ${user}`);
            return user;
        } catch (error) {
            logger.error(`Error al encontrar el usuario por token de reseteo:`, error);
            throw error;
        }
    }

    // Resetear contraseña
    async resetPassword(token, newPassword) {
        try {
            const user = await this.findUserByResetToken(token);
            if (!user) throw new Error("El usuario no existe");

            const hashedPassword = hashPassword(newPassword);
            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
        } catch (error) {
            logger.error(`Error al resetear la contraseña con token ${token}:`, error);
            throw error;
        }
    }

    // Verificar token de reseteo
    async verifyResetToken(token) {
        const user = await this.findUserByResetToken(token);
        if (!user) throw new Error("El token de restablecimiento no es válido");
        return user;
    }

    // Buscar usuarios inactivos
    async findInactiveUsers(thresholdDate) {
        try {
            const inactiveDate = new Date(Date.now() - minutes * 60000);
            return await userModel.find({ last_connection: { $lt: inactiveDate } });
        } catch (error) {
            logger.error("Error al buscar usuarios inactivos:", error);
            throw error;
        }
    }

    // Actualizar el rol de un usuario
    async updateUserRole(userId, role) {
        try {
            if (!isValidObjectId(userId)) throw new Error("El ID del usuario no es válido");
            return await userModel.findByIdAndUpdate(userId, { role }, { new: true, runValidators: true });
        } catch (error) {
            logger.error(`Error al actualizar el rol del usuario con ID ${userId}:`, error);
            throw error;
        }
    }

    // Eliminar usuario por ID
    async deleteUserById(userId) {
        try {
            if (!isValidObjectId(userId)) throw new Error("El ID del usuario no es válido");
            return await userModel.findByIdAndDelete(userId);
        } catch (error) {
            logger.error(`Error al eliminar el usuario con ID ${userId}:`, error);
            throw error;
        }
    }
}

export default new UserRepository();
