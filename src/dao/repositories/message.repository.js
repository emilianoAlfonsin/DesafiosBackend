import messageModel from "../models/messagesModel.js";
import { isValidObjectId } from "../../utils/utils.js";
import logger from "../../utils/logger.js";

class MessageRepository {
    async findAllMessages() {
        try {
            return await messageModel.find();
        } catch (error) {
            logger.error("Error al obtener todos los mensajes:", error);
            throw error;
        }
    }

    async createMessage(messageData) {
        try {
            const newMessage = new messageModel(messageData);
            return await newMessage.save();
        } catch (error) {
            logger.error("Error al crear el mensaje:", error);
            throw error;
        }
    }

    async deleteMessageById(id) {
        try {
            if (!isValidObjectId(id)) throw new Error("El ID del mensaje no es válido");
            return await messageModel.findByIdAndDelete(id);
        } catch (error) {
            logger.error(`Error al eliminar el mensaje con ID ${id}:`, error);
            throw error;
        }
    }
}

export default new MessageRepository();
