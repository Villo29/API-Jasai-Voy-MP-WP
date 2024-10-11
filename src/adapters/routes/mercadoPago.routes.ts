import { Router, Request, Response } from 'express';
import { MercadoPagoService } from '../../services/mercadoPagoService';  // Servicio de Mercado Pago

const router = Router();
const mercadoPagoService = new MercadoPagoService();  // Instancia del servicio

// Ruta para crear una preferencia de pago
router.post('/pago', async (req: Request, res: Response) => {
    try {
        // Variables de entorno para las URLs de redirección y webhook
        const baseUrl = process.env.BASE_URL || 'https://default-url.com';
        const notificationUrl = `${baseUrl}/api/v1/webhook`;

        const preferenceData = {
            ...req.body,
            back_urls: {
                success: `${baseUrl}/success`,
                failure: `${baseUrl}/failure`,
                pending: `${baseUrl}/pending`
            },
            notification_url: notificationUrl
        };

        console.log('Recibido preferenceData:', preferenceData);

        // Crear preferencia de pago usando el servicio
        const preferenceResponse = await mercadoPagoService.createPayment(preferenceData);

        return res.json({
            init_point: preferenceResponse.init_point,
            preference_id: preferenceResponse.id
        });
    } catch (error: any) {
        console.error('Error al procesar el pago:', error);
        res.status(500).json({ detail: error.message });
    }
});

// Ruta para el webhook de Mercado Pago
router.post('/api/v1/webhook', async (req: Request, res: Response) => {
    try {
        const notificacion = req.body;
        console.log('Recibida notificación:', notificacion);

        // Procesar la notificación usando el servicio
        await mercadoPagoService.processWebhook(notificacion);

        return res.status(200).json({ status: 'ok' });
    } catch (error: any) {
        console.error('Error al recibir la notificación:', error);
        res.status(500).json({ detail: error.message });
    }
});

export default router;
