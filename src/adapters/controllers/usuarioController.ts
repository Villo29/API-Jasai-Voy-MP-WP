import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Usuario, { IUsuario } from '../../domain/models/usuario';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';



export class UserController {
    constructor() { }

    // Crear un nuevo usuario
    crearUsuario = async (req: Request, res: Response) => {
        try {
            const { nombre, correo, contrasena, telefono } = req.body;

            // Verificar si el correo ya existe
            const correoExistente = await Usuario.findOne({ correo });
            if (correoExistente) {
                console.log(`El correo ${correo} ya está registrado.`);
                return res.status(400).json({ error: 'El correo ya está en uso.' });
            }

            // Generar un código de verificación único
            const codigoVerificacion = crypto.randomBytes(3).toString('hex');
            console.log(`Código de verificación generado: ${codigoVerificacion}`);

            // Crear un nuevo usuario con el código de verificación
            const usuario = new Usuario({
                nombre,
                correo,
                contrasena,
                telefono,
                codigoVerificacion,
            });
            await usuario.save();
            console.log(`Usuario ${nombre} guardado en la base de datos.`);

            // Generar un token JWT
            const token = jwt.sign(
                { _id: usuario._id },
                process.env.JWT_SECRET || 'your_secret_key'
            );
            console.log(`Token JWT generado: ${token}`);

            // Configurar Nodemailer con tu cuenta de Gmail
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: '221263@ids.upchiapas.edu.mx', // Tu dirección de correo de Gmail
                    pass: process.env.GMAIL_APP_PASSWORD, // Contraseña de aplicaciones de Gmail
                },
            });

            // Configurar los detalles del correo
            const mailOptions = {
                from: '221263@ids.upchiapas.edu.mx',
                to: correo, // Dirección de destinatario
                subject: '¡Bienvenido a nuestra plataforma!',
                text: `¡Hola ${nombre}!, tu código de verificación es: ${codigoVerificacion}`,
                html: `<h1>¡Hola ${nombre}!</h1>
                        <p>Gracias por unirte a nuestra plataforma. Tu código de verificación es:</p>
                        <h2>${codigoVerificacion}</h2>`,
            };

            // Enviar el correo usando Nodemailer
            const emailResponse = await transporter.sendMail(mailOptions);
            console.log('Correo enviado exitosamente:', emailResponse);

            // Enviar respuesta al cliente
            res.status(201).send({ token, nombre: usuario.nombre });
        } catch (error) {
            console.error('Error en crearUsuario:', error);
            res.status(500).send({ error: 'Error al crear el usuario o enviar el correo.' });
        }
    };


    // Validacion de usuario usando JWT
    loginUsuario = async (req: Request, res: Response) => {
        try {
            const { correo, contrasena } = req.body;
            const usuario = await Usuario.findOne({ correo });
            if (!usuario || usuario.contrasena !== contrasena) {
                return res.status(401).send({ error: 'Credenciales no válidas.' });
            }
            const token = jwt.sign({ _id: usuario._id }, process.env.JWT_SECRET || 'your_secret_key');
            res.send({ usuario, token });
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Obtener todos los usuarios
    obtenerUsuarios = async (req: Request, res: Response) => {
        try {
            const usuarios = await Usuario.find({});
            res.status(200).send(usuarios);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Obtener un usuario por ID
    obtenerUsuarioPorId = async (req: Request, res: Response) => {
        const _id = req.params.id;
        try {
            const usuario = await Usuario.findById(_id);
            if (!usuario) {
                return res.status(404).send();
            }
            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send(error);
        }
    };

    // Actualizar un usuario por ID
    actualizarUsuario = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body) as Array<keyof IUsuario>;
        const allowedUpdates: Array<keyof IUsuario> = ['nombre', 'correo', 'contrasena', 'telefono'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const usuario = await Usuario.findById(req.params.id);
            if (!usuario) {
                return res.status(404).send({ error: 'Usuario no encontrado' });
            }

            updates.forEach((update) => {
                (usuario as any)[update] = req.body[update];
            });
            await usuario.save();
            res.status(200).send(usuario);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Eliminar un usuario por ID
    eliminarUsuario = async (req: Request, res: Response) => {
        try {
            const usuario = await Usuario.findByIdAndDelete(req.params.id);
            if (!usuario) {
                return res.status(404).send();
            }
            res.status(200).send(usuario);
        } catch (error) {
            res.status(500).send(error);
        }
    };
}


export const crearUsuario = UserController.prototype.crearUsuario;

export const obtenerUsuarios = UserController.prototype.obtenerUsuarios;

export const obtenerUsuarioPorId = UserController.prototype.obtenerUsuarioPorId;

export const actualizarUsuario = UserController.prototype.actualizarUsuario;

export const eliminarUsuario = UserController.prototype.eliminarUsuario;

export const loginUsuario = UserController.prototype.loginUsuario;

