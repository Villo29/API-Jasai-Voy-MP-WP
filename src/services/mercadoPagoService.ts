import axios from 'axios';
import Notification from '../domain/models/notifation';  // Modelo para guardar las notificaciones en la base de datos

export class MercadoPagoService {
    async createPayment(preferenceData: any) {
        try {
            const preferenceResponse = await axios.post('https://api.mercadopago.com/checkout/preferences', preferenceData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            return preferenceResponse.data;
        } catch (error) {
            console.error('Error creando preferencia de pago:', error);
            throw error;
        }
    }

    async processWebhook(notificacion: any) {
        try {
            // Guardar la notificación en la base de datos
            const nuevaNotificacion = {
                action: notificacion.action || null,
                api_version: notificacion.api_version || null,
                data: { id: notificacion.data?.id || null },
                date_created: notificacion.date_created || null,
                resource: notificacion.resource || null,
                topic: notificacion.topic,
                id: notificacion.id || null,
                live_mode: notificacion.live_mode !== undefined ? notificacion.live_mode : null,
                type: notificacion.type || null
            };

            await Notification.updateOne({ id: notificacion.id }, nuevaNotificacion, { upsert: true });
            console.log('Notificación guardada en la base de datos');
        } catch (error) {
            console.error('Error al procesar el webhook:', error);
            throw error;
        }
    }
}
