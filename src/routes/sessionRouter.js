import { Router } from "express";
import passport from "passport";
import SessionController from "../controllers/session.controller.js";
import logger from "../utils/logger.js";
import UserDTO from "../dao/DTOs/user.dto.js";

const sessionRouter = Router();
const sessionController = new SessionController();

// Ruta para registrar un usuario.
sessionRouter.post(
    '/register/',
    (req, res, next) => {
        logger.info('Registrando usuario');
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                logger.error(`Error de autenticación: ${err}`);
                return next(err);
            }
            if (!user) {
                logger.error(`Error de registro: ${info.message}`);
                return res.status(400).json({
                    status: "failure",
                    errorCode: "BAD_REQUEST",
                    message: info ? info.message : "No se ha podido registrar el usuario"
                });
            }
            logger.info(`Usuario registrado: ${user.email}`);
            const userDTO = UserDTO.fromUser(user); // Transforma el objeto user en un DTO
            return res.status(201).json({
                status: "success",
                message: "Usuario registrado exitosamente",
                user: userDTO
            });
        })(req, res, next);
    }
);

// Ruta que retorna un mensaje de error de registro.
sessionRouter.get(
    "/failregister/",
    sessionController.failRegisterUser
);

// Ruta para loguear un usuario.
sessionRouter.post(
    "/login/",
    passport.authenticate("login", { failureRedirect: "/api/session/faillogin/" }),
    sessionController.loginUser
);

// Ruta que retorna un mensaje de error de login.
sessionRouter.get(
    "/faillogin/",
    sessionController.failLoginUser
);

// Ruta para loguear un usuario con GitHub.
sessionRouter.get(
    "/github/",
    passport.authenticate("github", { scope: ["user:email"] }),
    sessionController.github
);

// Ruta para loguear un usuario con GitHub.
sessionRouter.get(
    "/githubcallback/",
    passport.authenticate("github", { failureRedirect: "/" }),
    sessionController.githubCallback
);

// Ruta de logout de usuario.
sessionRouter.post(
    "/logout/",
    sessionController.logoutUser
);

// Rutas para recuperación de contraseña.
sessionRouter.post(
    "/forgotpassword/",
    sessionController.forgotPassword
);

// Ruta para verificar el token de recuperación de contraseña.
sessionRouter.get(
    "/reset-password/:token",
    sessionController.verifyResetToken
);

// Ruta para cambiar la contraseña del usuario.
sessionRouter.post(
    "/reset-password/:token",
    sessionController.resetPassword
);

// Ruta para obtener el usuario actualmente logueado.
sessionRouter.get(
    "/current",
    sessionController.currentUser
);

export default sessionRouter;

