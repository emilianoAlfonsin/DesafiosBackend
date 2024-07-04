import request from 'supertest'
import chai from 'chai'
import app from '../app.js'

const expect = chai.expect

describe('Session Router', async ()=>{
    it('deberia devolver un 200', (done)=>{
        request(app)
            .post('/login')
            .send({username: 'emiliano@mail.com', password: '123456'})
            .expect(200)
            .end((err, res)=>{
                expect(res.body).to.have.property('user')
                expect(res.body.user).to.equal('admin')
                done()
            })
    })
    it('deberia devolver un 401', (done)=>{
        request(app)
            .post('/login')
            .send({username: 'XXXXX', password: 'XXXXX'})
            .expect(401)
            .end((err, res)=>{
                done()
            })
    })
    it('deberia devolver un 500', (done)=>{
        request(app)
            .post('/login')
            .send({username: 'XXXXX', password: 'XXXXX'})
            .expect(500)
            .end((err, res)=>{
                done()
            })
    })
})