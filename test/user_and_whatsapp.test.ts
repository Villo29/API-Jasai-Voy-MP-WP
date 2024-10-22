// Importamos las dependencias necesarias
import request from 'supertest';
import { app } from '../src/infrastructure'; // Importar la aplicación Express
import { sendWhatsAppMessage } from '../src/services/twilioService';
import { crearUsuario } from '../src/adapters/controllers/usuarioController';

// Mock de los servicios externos
jest.mock('../src/services/twilioService', () => ({
    sendWhatsAppMessage: jest.fn(),
}));

jest.mock('../src/adapters/controllers/usuarioController', () => ({
    crearUsuario: jest.fn(),
}));

describe('Pruebas unitarias - Usuario y WhatsApp', () => {
    describe('Crear Usuario', () => {
        it('debería crear un usuario con éxito', async () => {
            // Datos de ejemplo para crear un usuario
            const userData = {
                username: 'testuser',
                email: 'testuser@example.com',
                password: 'password123',
            };

            // Mock del comportamiento esperado al crear un usuario
            (crearUsuario as jest.Mock).mockResolvedValue(userData);

            // Realizamos la petición para crear el usuario
            const response = await request(app)
                .post('/api/usuarios')
                .send(userData);

            // Verificamos que la respuesta sea exitosa
            expect(response.status).toBe(201);
            expect(response.body).toMatchObject(userData);
        });

        it('debería devolver un error si faltan datos del usuario', async () => {
            const userData = {
                username: 'testuser',
            };

            const response = await request(app)
                .post('/api/usuarios')
                .send(userData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Faltan campos obligatorios');
        });
    });

    describe('Enviar WhatsApp', () => {
        it('debería enviar un mensaje de WhatsApp con éxito', async () => {
            // Datos de ejemplo para enviar un mensaje
            const messageData = {
                to: '+1234567890',
                body: 'Hola, este es un mensaje de prueba',
            };

            // Mock del comportamiento esperado al enviar un mensaje
            (sendWhatsAppMessage as jest.Mock).mockResolvedValue({
                success: true,
                messageId: 'SM12345',
            });

            // Realizamos la petición para enviar el mensaje
            const response = await request(app)
                .post('/api/whatsapp/send')
                .send(messageData);

            // Verificamos que la respuesta sea exitosa
            expect(response.status).toBe(200);
            expect(response.body).toMatchObject({
                success: true,
                messageId: 'SM12345',
            });
        });

        it('debería devolver un error si faltan datos del mensaje', async () => {
            const messageData = {
                to: '+1234567890',
            };

            const response = await request(app)
                .post('/api/whatsapp/send')
                .send(messageData);

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('El cuerpo del mensaje es obligatorio');
        });
    });
});
