import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

// Validación de variables de entorno
if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
    throw new Error('MAIL_USERNAME y MAIL_PASSWORD deben estar definidas en las variables de entorno');
}

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

// Función para enviar correos electrónicos
export async function sendEmail({ to, subject, text, html }) {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        text: text,
        html: html // Permitir envío de correos en formato HTML
    };

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info('Correo enviado: ' + info.response)
        return info
    } catch (error) {
        logger.error('Error al enviar el correo: ', error)
        throw new Error(`Error al enviar el correo a ${to}: ${error.message}`)
    }
}
