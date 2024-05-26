import MessagesService from "../services/messages.service.js"

const messagesService = new MessagesService()

class MessagesController {
    async getAllMessages(req, res) {
        try {
            const messages = await messagesService.getAllMessages()
            res.status(200).json(messages)
        } catch (error) {
            res.status(500).json({ message: "Error al obtener los mensajes" })
        }
    }

    async addMessage(req, res) {
        try {
            const messageData = req.body
            const newMessage = await messagesService.addMessage(messageData)
            res.status(201).json(newMessage)
        } catch (error) {
            res.status(500).json({ message: "Error al crear el mensaje" })
        }
    }

    async deleteMessageById(req, res) {
        try {
            const { id } = req.params
            const deletedMessage = await messagesService.deleteMessageById(id)
            res.status(200).json(deletedMessage)
        } catch (error) {
            res.status(404).json({ message: "Mensaje no encontrado" })
        }
    }
}

export default new MessagesController()
