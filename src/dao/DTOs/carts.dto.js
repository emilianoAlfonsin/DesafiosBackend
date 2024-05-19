
export default class CartDTO {
    constructor({ _id, user, products }) {
        this.id = _id
        this.user = user
        this.products = products
    }

    static fromCartDocument(doc) {
        return new CartDTO({
            _id: doc._id,
            user: doc.user,
            products: doc.products
        })
    }

    static fromCartDocuments(docs) {
        return docs.map(doc => CartDTO.fromCartDocument(doc))
    }
}