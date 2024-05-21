
export default class ProductDTO {
    constructor(product) {
        this._id = product._id
        this.title = product.title
        this.description = product.description
        this.price = product.price
        this.thumbnail = product.thumbnail
        this.code = product.code
        this.stock = product.stock
        this.status = product.status
        this.category = product.category
    }

    static fromProductDocument(product) {
        return new ProductDTO(product)
    }
    static fromProductArray(products) {
        return products.map(product => new ProductDTO(product))
    }
}
