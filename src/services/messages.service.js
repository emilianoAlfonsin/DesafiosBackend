import MessageRepository from "../dao/repositories/message.repository.js"
import MessageDTO from "../dao/DTOs/message.dto.js"


export default class MessagesService {
    constructor() {
        this.dao = MessageRepository
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
