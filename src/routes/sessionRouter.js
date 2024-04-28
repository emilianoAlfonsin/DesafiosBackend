import { Router } from "express"
import userModel from "../dao/models/userModel.js"
import { hashPassword, isValidPassword} from "../utils.js"
import bcrypt from "bcrypt"
import passport from "passport"

const sessionRouter = Router()

// sessionRouter.post("/register", async (req, res) => {
//     console.log("Solicitud de POST recibida en /register")
//     const { first_name, last_name, email, password, age } = req.body

//     //Validar campos obligatorios
//     console.log(req.body);
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


sessionRouter.post("/register/", passport.authenticate("register", { failureRedirect: "/failregister" }), async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario registrado correctamente" })
})

sessionRouter.get("/failregister/", (req, res) => {
    console.log("error");
    res.status(400).send({ status: "error", message: "Error al registrar el usuario" })
})

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

sessionRouter.post("/login/", passport.authenticate("login", { failureRedirect: "/api/session/faillogin/" }), async (req, res) => {
    !req.user && res.status(404).send({ status: "error", message: "Error de autenticación" })
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    res.status(200).send({ status: "success", message: "Usuario logueado correctamente", payload: req.user })
})

sessionRouter.get("/faillogin/", (req, res) => {
    console.log("error");
    res.status(404).send({ status: "error", message: "Error al loguear el usuario" })
})

sessionRouter.get("/github/" , passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {
        console.log("Solicitud de GET recibida en /github")
})

sessionRouter.get("/githubcallback/", passport.authenticate("github", { failureRedirect: "/" }),
    async (req, res) => {
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
})


sessionRouter.get("/logout/", async (req, res) => {
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
})

sessionRouter.put("/restorePassword", async (req, res) => {
    const { email, password } = req.body
    console.log("Solicitud de PUT recibida en /restorePassword")

    !email || !password && res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })

    const user = await userModel.findOne({ email })
    !user && res.status(404).send({ status: "error", message: "Error de autenticación" })

    const newwPassword = hashPassword(password)

    const result = await userModel.updateOne({ email }, { password: newwPassword })
    console.log("Contraseña restaurada correctamente:", result)


    res.status(200).send({ status: "success", message: "Contraseña restaurada correctamente" })
})

sessionRouter.get("/current", (req, res) => {
    console.log("Solicitud de GET recibida en /current")
    req.session.user 
        ? res.send({ status: "success", message: "Usuario logueado correctamente", payload: req.session.user }) 
        : res.send({ status: "error", message: "Usuario no logueado" })
})

export default sessionRouter