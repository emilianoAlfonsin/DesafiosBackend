import MessageDAO from "../DAOs/message.mongo.dao.js"
import MessageDTO from "../DTOs/message.dto.js"

export default class MessagesService {
    constructor() {
        this.dao = MessageDAO
    }

    async getAllMessages() {
        const messages = await this.dao.findAllMessages()
        return MessageDTO.fromDocuments(messages)
    }

    async addMessage(messageData) {
        const savedMessage = await this.dao.createMessage(messageData)
        return MessageDTO.fromDocument(savedMessage)
    }

    async deleteMessageById(id) {
        const deletedMessage = await this.dao.deleteMessageById(id)
        if (!deletedMessage) throw new Error("Mensaje no encontrado")
        return MessageDTO.fromDocument(deletedMessage)
    }
}
