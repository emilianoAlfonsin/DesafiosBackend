import nodemailer from 'nodemailer'
import logger from '../utils/logger.js'

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

// Función para enviar correos electrónicos
export async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: to,
        subject: subject,
        text: text
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        logger.info('Correo enviado: ' + info.response)
        return info
    } catch (error) {
        logger.error('Error al enviar el correo: ', error)
        throw error
    }
}
