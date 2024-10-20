import { Twilio } from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

export const sendWhatsAppMessage = async (to: string, body: string) => {
    try {
        // Verificar el número de destino que estás enviando
        console.log(`Enviando mensaje a: ${to}`);  // Asegúrate de que aquí solo veas "whatsapp:+5219612835436"

        const message = await client.messages.create({
            body: body,
            from: process.env.TWILIO_WHATSAPP_NUMBER,  // Tu número de WhatsApp de Twilio desde la variable de entorno
            to: to
        });

        console.log('Mensaje enviado:', message.sid);
        return message;
    } catch (error) {
        if (error instanceof Error) {
            // Si `error` es una instancia de `Error`, tiene la propiedad `message`
            console.error('Error enviando mensaje de WhatsApp:', error.message);
            throw new Error(`Error sending WhatsApp message: ${error.message}`);
        } else {
            // En caso de que no sea del tipo `Error`
            console.error('Error desconocido enviando mensaje de WhatsApp:', error);
            throw new Error('Error desconocido enviando mensaje de WhatsApp');
        }
    }
};
