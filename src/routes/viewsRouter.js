import { Router } from 'express'
import ViewsController from '../controllers/views.controller.js'
import { auth } from '../middlewares/auth.js'


const viewsRouter = Router()
const viewsController = new ViewsController()

viewsRouter.get('/', viewsController.renderIndex)

viewsRouter.get('/register', viewsController.renderRegister)

viewsRouter.get('/restorePassword', viewsController.renderRestorePassword)

viewsRouter.get('/realtimeproducts', auth, viewsController.renderRealtimeProducts)

viewsRouter.get('/chat', auth, viewsController.renderChat)

viewsRouter.get('/products/', auth, viewsController.renderProducts)

viewsRouter.get('/products/:pid', auth, viewsController.renderProductDetails)

viewsRouter.get('/carts/:cid', auth, viewsController.renderCartById)

export default viewsRouter