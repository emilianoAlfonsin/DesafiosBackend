import { Router } from "express"
import userModel from "../dao/models/userModel.js"
import { hashPassword } from "../utils.js"
import bcrypt from "bcrypt"

const sessionRouter = Router()

sessionRouter.post("/register", async (req, res) => {
    console.log("Solicitud de POST recibida en /register")
    const { first_name, last_name, email, password, age } = req.body

    //Validar campos obligatorios
    console.log(req.body);
    console.log("Validando campos obligatorios")
    if (!first_name || !last_name || !email || !password || !age) {
        res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })
    }

    //Validar email
    console.log("Validando email", email)
    const existUser = await userModel.findOne({ email: email })
    existUser && res.send({ status: "error", message: "Ya existe un usuario registrado con ese email" })

    // Determinar el rol del usuario según su email
    let role = 'user'
    email === "admin@mail.com" && (role = 'admin')

    const newUser = { 
        first_name, 
        last_name, 
        email, 
        password:hashPassword(password), 
        age, 
        role
    }

    const result = await userModel.create(newUser)
    console.log("Usuario registrado correctamente:", result)

    res.status(201).send({ status: "success", message: "Usuario registrado correctamente", payload: result })

})

sessionRouter.post("/login/", async (req, res) => {
    try{
        const { email, password } = req.body
        console.log("Solicitud de POST recibida en /login")

        // Validar campos obligatorios
        !email || !password && res.status(400).send({ status: "error", message: "Todos los campos son obligatorios" })
        
        // Validar email
        const user = await userModel.findOne({ email })
        !user && res.status(404).send({ status: "error", message: "Error de autenticación" })

        // Validar contraseña
        const validatedPassword = await bcrypt.compare(password, user.password)
        !validatedPassword && res.status(404).send({ status: "error", message: "Error de autenticación" })

        req.session.user = {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role
        }
    
        res.status(200).send({ status: "success", message: "Usuario logueado correctamente", payload: req.session.user })
    } catch(error){
        console.log(error)
        res.status(500).send({ status: "error", message: "Error al loguear el usuario" })
    }
})

sessionRouter.get("/logout/", async (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.status(500).send({ status: "error", message: "Error al cerrar sesión" })
        } else {
            res.status(200).send({ status: "success", message: "Sesión cerrada correctamente" })
        }
    })
})

export default sessionRouter