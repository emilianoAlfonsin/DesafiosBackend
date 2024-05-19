import SessionService from "../dao/services/session.service.js"
import SessionDTO from "../dao/DTOs/session.dto.js"

const sessionService = new SessionService()

export default class SessionController {

    // Registro de usuarios.
    async registerUser(req, res) {
        try {
            const response = await sessionService.registerUser(req.body)
            res.status(201).json({
                status: "success",
                message: response
            })
        } catch (error) {
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al registrar usuario"
            })
        }
    }

    // Error al registrar usuario.
    async failRegisterUser(req, res) {
        res.status(400).send({
            status: "failure",
            errorCode: "BAD_REQUEST",
            message: "No se ha podido registrar el usuario"
        })
    }

    // Login de usuarios.
    async loginUser(req, res) {
        try {
            if (!req.user) {
                res.status(404).json({
                    status: "failure",
                    errorCode: "NOT_FOUND",
                    description: "Usuario no encontrado"
                })
            } else {
                const response = await sessionService.loginUser(req.user)
                const sessionDTO = SessionDTO.fromUserDTO(response.payload)
                req.session.user = sessionDTO
                res.status(200).json({
                    status: "success",
                    message: response
                })
            }
        } catch (error) {
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error al loguear usuario"
            })
        }
    }

    // Error al loguear usuario.
    async failLoginUser(req, res) {
        res.status(404).json({
            status: "failure",
            errorCode: "NOT_FOUND",
            description: "Usuario no encontrado"
        })
    }

    // Manejar la solicitud de inicio de sesión con github.
    async github(req, res) {
        console.log("Solicitud de GET recibida en /github")
    }

    // Manejar la respuesta de github
    async githubCallback(req, res) {
        try {
            req.session.user = {
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role,
                carts: req.user.carts
            }
            console.log(req.session.user)
            res.redirect("/products")
        } catch (error) {
            console.error("Error en el callback de GitHub:", error.message)
            res.status(500).json({
                status: "failure",
                errorCode: "INTERNAL_SERVER_ERROR",
                description: "Error en el callback de GitHub"
            })
        }
    }

    // Logout de usuarios.
    async logoutUser(req, res) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json({
                    status: "failure",
                    errorCode: "INTERNAL_SERVER_ERROR",
                    description: "Error al cerrar sesión"
                })
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Sesión cerrada correctamente"
                })
            }
        })
    }

    // Restaurar el password de un usuario.
    async restorePassword(req, res) {
        try {
            const { email, password } = req.body
            const response = await sessionService.restorePassword(email, password)
            res.status(200).json({
                status: "success",
                message: response
            })
        } catch (error) {
            res.status(400).send({
                status: "failure",
                errorCode: "BAD_REQUEST",
                message: error.message
            })
        }
    }

    // Obtener usuario actual.
    async currentUser(req, res) {
        try {
            const response = await sessionService.getCurrentUser(req.session)
            res.status(200).send(response)
        } catch (error) {
            res.status(400).send({ 
                status: "failure",
                errorCode: "BAD_REQUEST",
                message: error.message
            })
        }
    }
}
