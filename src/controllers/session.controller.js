import SessionService from "../services/session.service.js";
import SessionDTO from "../dao/DTOs/session.dto.js";
import logger from "../utils/logger.js";
import UserDTO from "../dao/DTOs/user.dto.js";
import { handleSuccess, handleError } from "../utils/responseHandler.js";

const sessionService = new SessionService();

export default class SessionController {

    // Registro de usuarios.
    async registerUser(req, res) {
        try {
            logger.info("Iniciando registro de usuario");
            const userData = req.body;
            const userDto = await sessionService.registerUser(userData);
            logger.info("Usuario registrado correctamente");
            return handleSuccess(res, 201, "Usuario registrado correctamente", userDto);
        } catch (error) {
            if (error.message.includes("El usuario ya existe")) {
                return handleError(res, 400, "USER_ALREADY_EXISTS", "Error al registrar usuario", error);
            } else if (error.message.includes("validation")) {
                return handleError(res, 400, "VALIDATION_ERROR", "Error de validación al registrar usuario", error);
            } else {
                return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al registrar usuario", error);
            }
        }
    }

    // Error al registrar usuario.
    async failRegisterUser(req, res) {
        logger.warn("Fallo al registrar usuario");
        return handleError(res, 400, "BAD_REQUEST", "Error al registrar usuario", new Error("Error al registrar usuario"));
    }

    // Login de usuarios.
    async loginUser(req, res) {
        try {
            logger.info("Iniciando login de usuario");
            if (!req.user) {
                return handleError(res, 404, "NOT_FOUND", "Usuario no encontrado", new Error("Usuario no encontrado"));
            }

            const userDTO = UserDTO.fromUser(req.user); // Asume que req.user es autenticado por passport
            const sessionDTO = SessionDTO.fromUserDTO(userDTO); // paso el userDTO por sessionDTO para que en sesión solo estén disponibles los datos necesarios
            req.session.user = sessionDTO;

            logger.info("Usuario logueado correctamente");
            return handleSuccess(res, 200, "Usuario logueado correctamente", sessionDTO);
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al loguear usuario", error);
        }
    }

    // Error al loguear usuario.
    async failLoginUser(req, res) {
        logger.warn("Fallo al loguear usuario");
        return handleError(res, 400, "BAD_REQUEST", "Error al loguear usuario", new Error("Error al loguear usuario"));
    }

    // Manejar la solicitud de inicio de sesión con github.
    async github(req, res) {
        logger.info("Solicitud de GET recibida en /github");
    }

    // Manejar la respuesta de github
    async githubCallback(req, res) {
        try {
            logger.info("Iniciando callback de GitHub");
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role,
                carts: req.user.carts
            };
            logger.info(`Usuario: ${req.session.user}`);
            return res.redirect("/products");
        } catch (error) {
            return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error en el callback de GitHub", error);
        }
    }

    // Logout de usuarios.
    async logoutUser(req, res) {
        logger.info("Iniciando logout de usuario");
        req.session.destroy(err => {
            if (err) {
                return handleError(res, 500, "INTERNAL_SERVER_ERROR", "Error al cerrar sesión", err);
            } else {
                logger.info("Sesión cerrada correctamente");
                return handleSuccess(res, 200, "Sesión cerrada correctamente", null);
            }
        });
    }

    // Obtener usuario actual.
    async currentUser(req, res) {
        try {
            logger.info("Obteniendo usuario actual");
            const response = await sessionService.getCurrentUser(req.session);
            return handleSuccess(res, 200, "Usuario actual", response);
        } catch (error) {
            return handleError(res, 400, "BAD_REQUEST", "Error al obtener usuario actual", error);
        }
    }

    // Enviar enlace de recuperación de contraseña
    async forgotPassword(req, res) {
        try {
            const { email } = req.body;
            logger.info("Solicitud de restablecimiento de contraseña recibida", email);
            await sessionService.forgotPassword(email);
            return handleSuccess(res, 200, "Correo de recuperación enviado", null);
        } catch (error) {
            return handleError(res, 400, "BAD_REQUEST", "Error al enviar correo de recuperación", error);
        }
    }

    // Verificar el token de restablecimiento de contraseña
    async verifyResetToken(req, res) {
        try {
            const { token } = req.params;
            logger.info("Verificando token de restablecimiento de contraseña");
            const isValid = await sessionService.verifyResetToken(token);
            if (isValid) {
                return res.status(200).render('resetPassword', { token });
            } else {
                return handleError(res, 400, "INVALID_TOKEN", "Token inválido o expirado", new Error("Token inválido o expirado"));
            }
        } catch (error) {
            return handleError(res, 400, "BAD_REQUEST", "Error al verificar token de restablecimiento", error);
        }
    }

    // Restablecer la contraseña
    async resetPassword(req, res) {
        try {
            const { token } = req.params;
            const { password } = req.body;
            logger.info("Restableciendo contraseña");
            await sessionService.resetPassword(token, password);
            return handleSuccess(res, 200, "Contraseña restablecida correctamente", null);
        } catch (error) {
            return handleError(res, 400, "BAD_REQUEST", "Error al restablecer contraseña", error);
        }
    }

    // Cambiar el rol del usuario actual. Solo para usuarios con rol "admin".
    async changeUserRole(req, res) {
        try {
            const { uid } = req.params;
            const { role } = req.body;
            logger.info(`Cambiando rol de usuario con id ${uid}`);
            await sessionService.changeUserRole(uid, role);
            return handleSuccess(res, 200, "Rol de usuario cambiado correctamente", null);
        } catch (error) {
            return handleError(res, 400, "BAD_REQUEST", "Error al cambiar rol de usuario", error);
        }
    }
}
