import axios from 'axios';
import Notification from '../domain/models/notifation';
import { sendWhatsAppMessage } from '../services/twilioService'; // Importar Twilio Service

export class MercadoPagoService {
    // Método para crear un pago
    async createPayment(preferenceData: any) {
        try {
            // Crear la preferencia de pago en Mercado Pago
            const preferenceResponse = await axios.post('https://api.mercadopago.com/checkout/preferences', preferenceData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
                }
            });
            const linkDePago = preferenceResponse.data.init_point;
            const telefono = preferenceData.payer.telefono;
            if (!telefono) {
                throw new Error('Número de teléfono no proporcionado en preferenceData.payer');
            }
            const numeroDestino = `whatsapp:${telefono}`;
            const mensajeWhatsApp = `Tu enlace de pago es el siguiente: ${linkDePago}`;
            await sendWhatsAppMessage(numeroDestino, mensajeWhatsApp);
            return preferenceResponse.data;
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error creando preferencia de pago:', error.message);
                throw new Error(`Error creando preferencia de pago: ${error.message}`);
            } else {
                console.error('Error desconocido creando preferencia de pago:', error);
                throw new Error('Error desconocido creando preferencia de pago');
            }
        }
    }




    // Método para procesar las notificaciones del webhook
    async processWebhook(notificacion: any) {
        try {
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

            // Enviar mensaje de WhatsApp después de procesar el webhook
            const mensajeWhatsApp = `Nueva notificación recibida. ID de la notificación: ${notificacion.id}`;
            const numeroDestino = 'whatsapp:+14155238886';
            await sendWhatsAppMessage(numeroDestino, mensajeWhatsApp);

        } catch (error) {
            console.error('Error al procesar el webhook:', error);
            throw error;
        }
    }
}
