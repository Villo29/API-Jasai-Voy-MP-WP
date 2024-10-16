import express from 'express';
import  whatsappRoutes from './whatsapp.routes';
import mercadoPagoRoutes from './mercadoPago.routes';
import usuariosRoutes from './usuarios.routes';

const router = express.Router();

// Prefijo de versión
const apiVersion = '/v1';


router.use(`${apiVersion}/send-whatsapp`, whatsappRoutes);
router.use(`${apiVersion}/mercado-pago`, mercadoPagoRoutes);
router.use(`${apiVersion}/usuarios`, usuariosRoutes);

export default router;
