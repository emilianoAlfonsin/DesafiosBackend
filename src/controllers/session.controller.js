import userModel from "../dao/models/userModel.js"
import { hashPassword } from "../utils.js"

export default class SessionController {
    
    // Registro de usuarios.
    async registerUser(req, res){
        res.status(201).send({ 
            status: "success",
            message: "Usuario registrado correctamente" 
        })
    }

    // Error al registrar usuario.
    async failRegisterUser(req, res){
        res.status(400).send({
            status: "error",
            message: "No se ha podido registrar el usuario"
        })
    }

    // Login de usuarios.
    async loginUser(req, res){
        !req.user && res.status(404).send({ status: "error", message: "Error de autenticación" })
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        res.status(200).send({ status: "success", message: "Usuario logueado correctamente", payload: req.user })
    }

    // Error al loguear usuario.
    async failLoginUser(req, res){
        res.status(404).send({ 
            status: "error", 
            message: "Error al loguear el usuario" 
        })
    }

    // Manejar la solicitud de inicio de sesión con github.
    async github(req, res){
        console.log("Solicitud de GET recibida en /github")
    }

    // Manejar la respuesta de github
    async githubCallback(req, res){
        console.log("Solicitud de GET recibida en /githubcallback")
        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        }
        console.log(req.session.user)
        res.redirect("/products")
    }

    // Logout de usuarios.
    async logoutUser(req, res){
        req.session.destroy(err => {
            if (err) {
                res
                .status(500)
                .send({ status: "error", message: "Error al cerrar sesión" })
            } else {
                res
                .status(200)
                // .send({ status: "success", message: "Sesión cerrada correctamente" })
                .redirect("/")
            }
        })
    }

    // Restaurar el password de un usuario.
    async restorePassword(req, res){
        const { email, password } = req.body
        console.log("Solicitud de PUT recibida en /restorePassword")

        !email || !password && res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })

        const user = await userModel.findOne({ email })
        !user && res.status(404).send({ status: "error", message: "Error de autenticación" })

        const newPassword = hashPassword(password)

        const result = await userModel.updateOne({ email }, { password: newPassword })
        console.log("Contraseña restaurada correctamente:", result)

        res.status(200).send({ status: "success", message: "Contraseña restaurada correctamente" })
    }

    async currentUser(req, res){
        console.log("Solicitud de GET recibida en /current")
        req.session.user 
            ? res.send({ status: "success", message: "Usuario logueado correctamente", payload: req.session.user }) 
            : res.send({ status: "error", message: "Usuario no logueado" })
    }
}