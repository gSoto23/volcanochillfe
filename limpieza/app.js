const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

const app = express();
const upload = multer();

// Configuración de SendGrid
if (!process.env.SENDGRID_API_KEY) {
    console.error('Error: SENDGRID_API_KEY no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.FROM_EMAIL || !process.env.TO_EMAIL) {
    console.error('Error: FROM_EMAIL o TO_EMAIL no están definidos en el archivo .env');
    process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta para enviar el reporte
app.post('/api/enviar-reporte', upload.array('imagenes'), async (req, res) => {
    try {
        const { asunto, mensaje } = req.body;
        const imagenes = req.files;

        if (!asunto || !mensaje) {
            return res.status(400).json({
                success: false,
                message: 'El asunto y el mensaje son requeridos'
            });
        }

        // Convertir las imágenes a formato base64 para SendGrid
        const attachments = imagenes.map((imagen, index) => ({
            content: imagen.buffer.toString('base64'),
            filename: `imagen${index + 1}.jpg`,
            type: imagen.mimetype,
            disposition: 'attachment'
        }));

        const msg = {
            to: process.env.TO_EMAIL,
            from: process.env.FROM_EMAIL,
            subject: asunto,
            text: mensaje,
            attachments: attachments
        };

        console.log('Enviando email a:', process.env.TO_EMAIL);
        console.log('Desde:', process.env.FROM_EMAIL);

        try {
            await sgMail.send(msg);
            console.log('Email enviado exitosamente');
            res.json({ success: true, message: 'Reporte enviado con éxito' });
        } catch (emailError) {
            console.error('Error al enviar email:', emailError);
            if (emailError.response) {
                console.error(emailError.response.body);
            }
            throw emailError;
        }
    } catch (error) {
        console.error('Error al enviar el reporte:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el reporte: ' + error.message
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    console.log('Configuración cargada:');
    console.log('- FROM_EMAIL:', process.env.FROM_EMAIL);
    console.log('- TO_EMAIL:', process.env.TO_EMAIL);
    console.log('- API KEY presente:', !!process.env.SENDGRID_API_KEY);
});