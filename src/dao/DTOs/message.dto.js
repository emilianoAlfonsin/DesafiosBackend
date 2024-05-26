class MessageDTO {
    constructor({ id, user, message }) {
        this.id = id
        this.user = user
        this.message = message
    }

    static fromDocument(doc) {
        return new MessageDTO({
            id: doc._id.toString(),
            user: doc.user,
            message: doc.message
        })
    }

    static fromDocuments(docs) {
        return docs.map(doc => MessageDTO.fromDocument(doc))
    }
}

export default MessageDTO
