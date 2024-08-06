// Objetivo: Definir la estructura de un DTO de producto
export default class ProductDTO {
    constructor(product) {
        if (!product || typeof product !== 'object') {
            throw new Error('Objeto de producto inválido');
        }

        this._id = product._id || '';
        this.title = product.title || '';
        this.description = product.description || '';
        this.price = product.price || 0;
        this.thumbnail = product.thumbnail || '';
        this.code = product.code || '';
        this.stock = product.stock || 0;
        this.status = product.status || false;
        this.category = product.category || '';

        Object.freeze(this); // Congela el objeto para que no se pueda modificar.
    }

    // Método para convertir un DTO a un documento de producto
    static fromProductDocument(product) {
        return new ProductDTO(product);
    }

    // Método para convertir documentos a DTOs
    static fromProductArray(products) {
        return products.map(product => new ProductDTO(product));
    }
}
