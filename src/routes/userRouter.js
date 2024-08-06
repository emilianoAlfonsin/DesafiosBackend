import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import upload from "../config/multer.config.js";
import { auth } from "../middlewares/auth.js";

const userRouter = Router();
const userController = new UserController();

// Obtener todos los usuarios (solo accesible por el admin)
userRouter.get('/', auth('admin'), userController.getAllUsers);

// Ruta para actualizar un usuario a premium
userRouter.post('/premium/:uid', userController.updateToPremium);

// Ruta para subir documentos de un usuario
userRouter.post('/:uid/documents', upload.single('file'), userController.uploadDocuments);

// Eliminar usuarios inactivos (solo accesible por el admin)
userRouter.delete('/', auth('admin'), userController.deleteInactiveUsers);

// Rutas de administración de usuarios (solo accesible por el admin)
userRouter.get('/admin/users', auth('admin'), userController.getAdminView);
userRouter.post('/admin/users/:uid/role', auth('admin'), userController.modifyUserRole);
userRouter.delete('/admin/users/:uid', auth('admin'), userController.deleteUser);

export default userRouter;
