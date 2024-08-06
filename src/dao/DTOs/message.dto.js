// Objetivo: Definir la estructura de un DTO de mensaje
class MessageDTO {
    constructor({ id, user, message }) {
        this.id = id
        this.user = user
        this.message = message
    }

    // Método para convertir un DTO a un documento
    static fromDocument(doc) {
        return new MessageDTO({
            id: doc._id.toString(),
            user: doc.user,
            message: doc.message
        })
    }

    // Método para convertir documentos a DTOs
    static fromDocuments(docs) {
        return docs.map(doc => MessageDTO.fromDocument(doc))
    }
}

export default MessageDTO
