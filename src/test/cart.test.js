import request from 'supertest'
import chai from 'chai'
import app from '../app.js'

export const agent = request.agent(app)

describe('Cart Router', () =>{
    it('debería obtener todos los carritos', async()=>{
        const response = await agent.get('/api/cart')
        chai.expect(response.status).equal(200)
    })

    it('debería crear un carrito', async()=>{
        const response = await agent.post('/api/cart')
        chai.expect(response.status).equal(200)
    })

    it('debería obtener un carrito por id', async()=>{
        const response = await agent.get('/api/cart/666a1d02c9deca6f2529ef41')
        chai.expect(response.status).equal(200)
    })
})