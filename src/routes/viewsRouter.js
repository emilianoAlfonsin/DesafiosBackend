import { Router } from 'express'
import ViewsController from '../controllers/views.controller.js'
import { auth } from '../middlewares/auth.js'


const viewsRouter = Router()
const viewsController = new ViewsController()

viewsRouter.get('/', viewsController.renderIndex)

viewsRouter.get('/register', viewsController.renderRegister)

viewsRouter.get('/restorePassword', viewsController.renderRestorePassword)

// esta ruta no debería tener funcionalidad en el estado actual del proyecto.
// viewsRouter.get('/realtimeproducts', auth, viewsController.renderRealtimeProducts)

viewsRouter.get('/chat',  viewsController.renderChat)

viewsRouter.get('/products/', viewsController.renderProducts)

viewsRouter.get('/products/:pid',  viewsController.renderProductDetails)

viewsRouter.get('/carts/:cid',  viewsController.renderCartById)

export default viewsRouter