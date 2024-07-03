import request from 'supertest'
import chai from 'chai'
import app from '../app.js'

const expect = chai.expect

describe('Product Router', ()=>{
    it('debería retornar todos los productos', (done)=>{
        request(app)
            .get('/api/products')
            .expect(200)
            .end((err, res)=>{
                expect(res.body).to.be.an('array')
                done()
            })
    })
    it('debería retornar un producto por id', (done)=>{
        request(app)
            .get('/api/products/660e0ab2194c51f5a5fed71e')
            .expect(200)
            .end((err, res)=>{
                expect(res.body).to.be.an('object')
                done()
            })
    })
    it('debería crear un producto', (done)=>{
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
        }
        request(app)
            .post('/api/products')
            .send(newProduct)
            .expect(201)
            .end((err, res)=>{
                expect(res.body).to.be.an('object')
                done()
            })
    })
})