import { Router } from "express"
import passport from "passport"
import SessionController from "../controllers/session.controller.js"
import logger from "../utils/logger.js"
import UserDTO from "../dao/DTOs/user.dto.js"

const sessionRouter = Router()
const sessionController = new SessionController()

// Ruta para registrar un usuario.
sessionRouter.post(
    '/register/',
    (req, res, next) => {
        logger.info('Registrando usuario')
        passport.authenticate('register', (err, user, info) => {
            if (err) {
                logger.error(`Error de autenticación: ${err}`)
                return next(err)
            }
            if (!user) {
                logger.error(`Error de registro: ${info.message}`)
                return res.status(400).json({
                    status: "failure",
                    errorCode: "BAD_REQUEST",
                    message: info ? info.message : "No se ha podido registrar el usuario"
                })
            }
            logger.info(`Usuario registrado: ${user.email}`)
            const userDTO = UserDTO.fromUser(user) // Transforma el objeto user en un DTO
            return res.status(201).json({
                status: "success",
                message: "Usuario registrado exitosamente",
                user: userDTO
            })
        })(req, res, next)
    }
)

// Ruta que retorna un mensaje de error de registro.
sessionRouter.get(
    "/failregister/",
    sessionController.failRegisterUser
)

// Ruta para loguear un usuario.
sessionRouter.post(
    "/login/", 
    passport.authenticate("login", { failureRedirect: "/api/session/faillogin/" })
    ,sessionController.loginUser
)

// Ruta que retorna un mensaje de error de login.
sessionRouter.get(
    "/faillogin/", 
    sessionController.failLoginUser
)

// Ruta para loguear un usuario con GitHub.
sessionRouter.get(
    "/github/", 
    passport.authenticate("github", { scope: ["user:email"] }), 
    sessionController.github
)

// Ruta para loguear un usuario con GitHub.
sessionRouter.get(
    "/githubcallback/", 
    passport.authenticate("github", { failureRedirect: "/" }), 
    sessionController.githubCallback
)

// Ruta de logout de usuario.
sessionRouter.post(
    "/logout/", 
    sessionController.logoutUser
)

// Rutas para recuperación de contraseña.
sessionRouter.post(
    "/forgotpassword/",
    sessionController.forgotPassword
)
// Ruta para verificar el token de recuperación de contraseña.
sessionRouter.get(
    "/reset-password/:token",
    sessionController.verifyResetToken
)
// Ruta para cambiar la contraseña del usuario.
sessionRouter.post(
    "/reset-password/:token",
    sessionController.resetPassword 
)

// Ruta para obtener el usuario actualmente logueado.
sessionRouter.get(
    "/current", 
    sessionController.currentUser
)

// Dentro de sessionRouter.js

// Ruta para cambiar el rol de un usuario
sessionRouter.post(
    "/premium/:uid", 
    sessionController.changeUserRole
)

export default sessionRouter



// sessionRouter.post("/register", async (req, res) => {
//     console.log("Solicitud de POST recibida en /register")
//     const { first_name, last_name, email, password, age } = req.body

//     //Validar campos obligatorios
//     console.log(req.body) 
//     console.log("Validando campos obligatorios")
//     if (!first_name || !last_name || !email || !password || !age) {
//         res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })
//     }

//     //Validar email
//     console.log("Validando email", email)
//     const existUser = await userModel.findOne({ email: email })
//     existUser && res.send({ status: "error", message: "Ya existe un usuario registrado con ese email" })

//     // Determinar el rol del usuario según su email
//     let role = 'user'
//     email === "adminCoder@coder.com" && (role = 'admin')

//     const newUser = { 
//         first_name, 
//         last_name, 
//         email, 
//         password:hashPassword(password), 
//         age, 
//         role
//     }

//     const result = await userModel.create(newUser)
//     console.log("Usuario registrado correctamente:", result)

//     res.status(201).send({ status: "success", message: "Usuario registrado correctamente", payload: result })

// })

// sessionRouter.post("/login/", async (req, res) => {
//     try{
//         const { email, password } = req.body
//         console.log("Solicitud de POST recibida en /login")

//         // Validar campos obligatorios
//         if (!email || !password) {
//             return res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })
//         }
        
//         // Validar email
//         const user = await userModel.findOne({ email })
//         if (!user){
//             return res.status(404).send({ status: "error", message: "Error de autenticación" })
//         }

//         // Validar contraseña
//         const validatedPassword = await bcrypt.compare(password, user.password)
//         if (!validatedPassword) {
//             return res.status(400).send({ status: "error", message: "Error de autenticación" })
//         }

//         req.session.user = {
//             first_name: user.first_name,
//             last_name: user.last_name,
//             email: user.email,
//             age: user.age,
//             role: user.role
//         }
    
//         res
//         .status(200)
//         .send({ status: "success", message: "Usuario logueado correctamente", payload: req.session.user })
//     } catch(error){
//         console.log(error)
//         res
//         .status(500)
//         .send({ status: "error", message: "Error al loguear el usuario" })
//     }
// })
