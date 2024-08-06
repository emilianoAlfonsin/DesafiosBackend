import request from 'supertest';
import chai from 'chai';
import app from '../app.js';

const { expect } = chai;

describe('Session Router', () => {
    let agent;

    before(() => {
        agent = request.agent(app);
    });

    it('debería devolver un 200 y el usuario admin', async () => {
        const response = await agent
            .post('/login')
            .send({ username: 'emiliano@mail.com', password: '123456' });
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.equal('admin');
    });

    it('debería devolver un 401 para credenciales incorrectas', async () => {
        const response = await agent
            .post('/login')
            .send({ username: 'XXXXX', password: 'XXXXX' });
        
        expect(response.status).to.equal(401);
    });

    it('debería devolver un 500 para un error del servidor', async () => {
        // Simula un error del servidor si es necesario
        const response = await agent
            .post('/login')
            .send({ username: 'XXXXX', password: 'XXXXX' });
        
        expect(response.status).to.equal(500);
    });

    it('debería registrar un nuevo usuario', async () => {
        const response = await agent
            .post('/register')
            .send({ username: 'newuser@mail.com', password: '123456' });
        
        expect(response.status).to.equal(201);
        expect(response.body).to.have.property('user');
        expect(response.body.user).to.equal('newuser@mail.com');
    });

    it('debería permitir al usuario cerrar sesión', async () => {
        await agent
            .post('/login')
            .send({ username: 'emiliano@mail.com', password: '123456' });

        const response = await agent.post('/logout');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Logout successful');
    });

    it('debería denegar acceso a una ruta protegida sin autenticación', async () => {
        const response = await agent.get('/protected-route');
        
        expect(response.status).to.equal(401);
        expect(response.body).to.have.property('message', 'Unauthorized');
    });

    it('debería permitir acceso a una ruta protegida con autenticación', async () => {
        await agent
            .post('/login')
            .send({ username: 'emiliano@mail.com', password: '123456' });

        const response = await agent.get('/protected-route');
        
        expect(response.status).to.equal(200);
        expect(response.body).to.have.property('message', 'Access granted');
    });
});