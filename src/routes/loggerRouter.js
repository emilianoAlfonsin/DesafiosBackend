import logger from "../utils/logger.js";
import { Router } from "express";

const logerTestRouter = Router();

logerTestRouter.get('/loggertest', (req, res) => {
    try {
        // Enviar diferentes niveles de logs
        logger.debug('Este es un mensaje debug');
        logger.http('Este es un mensaje http');
        logger.info('Este es un mensaje info');
        logger.warn('Este es un mensaje warning');
        logger.error('Este es un mensaje error');
        logger.fatal('Este es un mensaje fatal');
        
        res.send('Logs de prueba enviados!');
    } catch (error) {
        logger.error('Error al enviar logs de prueba:', error);
        res.status(500).send('Error interno del servidor');
    }
});

export default logerTestRouter;
