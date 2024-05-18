
export default class ProductDTO {
    constructor({ _id, title, description, price, thumbnail, code, stock, status, category }) {
        this.id = _id
        this.title = title
        this.description = description
        this.price = price
        this.thumbnail = thumbnail
        this.code = code
        this.stock = stock
        this.status = status
        this.category = category
    }

    // Metodo estático para convertir el documento de mongo en un DTO
    static fromProductDocument(doc) {
        return new ProductDTO({
            _id: doc._id,
            title: doc.title,
            description: doc.description,
            price: doc.price,
            thumbnail: doc.thumbnail,
            code: doc.code,
            stock: doc.stock,
            status: doc.status,
            category: doc.category
        })
    }

    // Método estatico para convertir un array de documentos en un array de DTOs
    static fromProductDocuments(docs) {
        return docs.map(doc => ProductDTO.fromProductDocument(doc))
    }
}
