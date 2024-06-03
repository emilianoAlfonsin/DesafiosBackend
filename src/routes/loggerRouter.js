import logger from "../utils/logger.js"
import { Router } from "express"

const logerTestRouter = Router()

logerTestRouter.get('/loggertest', (req,res)=>{
    logger.debug('Este es un mensaje debug')
    logger.http('Este es un mensaje http')
    logger.info('Este es un mensaje info')
    logger.warn('Este es un mensaje warning')
    logger.error('Este es un mensaje error')
    logger.fatal('Este es un mensaje fatal')
    
    res.send('Logs de prueba enviados!')
})

export default logerTestRouter
