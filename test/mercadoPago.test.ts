import request from 'supertest';
import { app } from '../src/infrastructure/index'; // Adjust the path as necessary to point to your main app file

describe('POST api/v1/mercado-pago/pago', () => {
    it('Debe crear una preferencia de pago correctamente', async () => {
        const preferenceData = {
            items: [
                {
                    title: 'Producto de prueba',
                    quantity: 1,
                    unit_price: 100
                }
            ]
        };

        const response = await request(app)
            .post('api/v1/mercado-pago/pago   ')
            .send(preferenceData)
            .expect(200);  // Esperamos que la respuesta sea 200

        // Verificamos que la respuesta tenga los campos init_point y preference_id
        expect(response.body).toHaveProperty('init_point');
        expect(response.body).toHaveProperty('preference_id');
    });
});

describe('POST /api/v1/webhook', () => {
    it('Debe procesar correctamente la notificación de Mercado Pago', async () => {
        const notificationData = {
            id: '12345',
            topic: 'payment',
            data: {
                id: '67890'
            }
        };

        const response = await request(app)
            .post('/api/v1/webhook')
            .send(notificationData)
            .expect(200);  // Esperamos que la respuesta sea 200

        // Verificamos que la respuesta tenga el status 'ok'
        expect(response.body).toEqual({ status: 'ok' });
    });
});
