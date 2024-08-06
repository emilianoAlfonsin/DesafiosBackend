// Objetivo: Definir la estructura de un DTO de carrito
export default class CartDTO {
    constructor({ _id, user, products }) {
        if (!_id || !user || !products) {
            throw new Error("Missing required properties");
        }
        this.id = _id;
        this.user = user;
        this.products = products;
    }

    // Método para convertir un documento de carrito a un DTO
    static fromCartDocument(doc) {
        if (!doc) {
            throw new Error("Document is required");
        }
        return new CartDTO({
            _id: doc._id,
            user: doc.user,
            products: doc.products
        });
    }

    // Método para convertir un DTO a un documento de carrito
    static fromCartDocuments(docs) {
        if (!Array.isArray(docs)) {
            throw new Error("Documents should be an array");
        }
        return docs.map(doc => CartDTO.fromCartDocument(doc));
    }
}