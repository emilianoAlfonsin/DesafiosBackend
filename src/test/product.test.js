import request from 'supertest';
import chai from 'chai';
import app from '../app.js';

const expect = chai.expect;

describe('Product Router', () => {
    let productId;

    // Crear un producto antes de las pruebas
    before((done) => {
        const newProduct = {
            title: 'Test Product',
            description: 'A product for testing',
            price: 99.99,
            thumbnail: 'http://example.com/test-product.jpg',
            code: 'test1234',
            stock: 10,
            status: true,
            category: 'Test Category',
            owner: 'admin'
        };
        request(app)
            .post('/api/products')
            .send(newProduct)
            .end((err, res) => {
                productId = res.body.id;
                done();
            });
    });

    // Eliminar el producto después de las pruebas
    after((done) => {
        request(app)
            .delete(`/api/products/${productId}`)
            .end(() => {
                done();
            });
    });

    it('debería retornar todos los productos', (done) => {
        request(app)
            .get('/api/products')
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('array');
                done();
            });
    });

    it('debería retornar un producto por id', (done) => {
        request(app)
            .get(`/api/products/${productId}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('id', productId);
                done();
            });
    });

    it('debería crear un producto', (done) => {
        const newProduct = {
            title: 'Another Test Product',
            description: 'Another product for testing',
            price: 49.99,
            thumbnail: 'http://example.com/another-test-product.jpg',
            code: 'test5678',
            stock: 5,
            status: true,
            category: 'Another Test Category',
            owner: 'admin'
        };
        request(app)
            .post('/api/products')
            .send(newProduct)
            .expect(201)
            .end((err, res) => {
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('title', newProduct.title);
                done();
            });
    });
})