import { Router } from 'express';
import ViewsController from '../controllers/views.controller.js';
import { auth } from '../middlewares/auth.js';

const viewsRouter = Router();
const viewsController = new ViewsController();


viewsRouter.get('/', viewsController.renderIndex);

viewsRouter.get('/register', viewsController.renderRegister);

viewsRouter.get('/forgot-password', viewsController.renderForgotPassword);

viewsRouter.get('/restorePassword', viewsController.renderRestorePassword);

viewsRouter.get('/resetPassword', viewsController.renderResetPassword);

viewsRouter.get('/chat', auth('user'), viewsController.renderChat);

viewsRouter.get('/products',  viewsController.renderProducts);

viewsRouter.get('/products/:pid', auth('user'), viewsController.renderProductDetails);

viewsRouter.get('/carts/:cid', auth('user'), viewsController.renderCartById);

viewsRouter.get('/updateUserRole', auth('admin'), viewsController.renderUpdateUserRole);

export default viewsRouter;