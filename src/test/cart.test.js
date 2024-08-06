import request from 'supertest';
import chai from 'chai';
import app from '../app.js';

const { expect } = chai;
export const agent = request.agent(app);

describe('Cart Router', () => {
    let cartId;
    let productId = 'someProductId'; // Asume que tienes un ID de producto válido

    // Crear un carrito antes de las pruebas
    before(async () => {
        const response = await agent.post('/api/cart');
        expect(response.status).to.equal(200);
        cartId = response.body.id; // Asume que la respuesta contiene el ID del carrito
    });

    // Eliminar el carrito después de las pruebas
    after(async () => {
        await agent.delete(`/api/cart/${cartId}`);
    });

    it('debería obtener todos los carritos', async () => {
        const response = await agent.get('/api/cart');
        expect(response.status).to.equal(200);
        expect(response.body).to.be.an('array');
    });

    it('debería crear un carrito', async () => {
        const response = await agent.post('/api/cart');
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id');
    });

    it('debería obtener un carrito por id', async () => {
        const response = await agent.get(`/api/cart/${cartId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', cartId);
    });

    it('debería añadir un producto al carrito', async () => {
        const response = await agent.post(`/api/cart/${cartId}/product`).send({ productId, quantity: 1 });
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', cartId);
        expect(response.body.products).to.be.an('array').that.is.not.empty;
    });

    it('debería eliminar un producto del carrito', async () => {
        const response = await agent.delete(`/api/cart/${cartId}/product/${productId}`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', cartId);
        expect(response.body.products).to.be.an('array').that.is.empty;
    });

    it('debería vaciar el carrito', async () => {
        // Añadir un producto primero
        await agent.post(`/api/cart/${cartId}/product`).send({ productId, quantity: 1 });

        // Luego vaciar el carrito
        const response = await agent.delete(`/api/cart/${cartId}/clear`);
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('id', cartId);
        expect(response.body.products).to.be.an('array').that.is.empty;
    });

    it('debería retornar un error si el carrito no existe', async () => {
        const response = await agent.get('/api/cart/nonexistentid');
        expect(response.status).to.equal(404);
        expect(response.body).to.have.property('message', 'Cart not found');
    });
});