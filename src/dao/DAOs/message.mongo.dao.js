import messageModel from "../models/messagesModel.js"
import { isValidObjectId } from "../../utils/utils.js"

class MessageDAO {
    async findAllMessages() {
        return await messageModel.find()
    }

    async createMessage(messageData) {
        const newMessage = new messageModel(messageData)
        return await newMessage.save()
    }

    async deleteMessageById(id) {
        if (!isValidObjectId(id)) throw new Error("El ID del mensaje no es válido")
        return await messageModel.findByIdAndDelete(id)
    }
}

export default new MessageDAO()
