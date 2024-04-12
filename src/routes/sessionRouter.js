import { Router } from "express"
import userModel from "../dao/models/userModel"

const userRouter = Router()

userRouter.get("/register/", async (req, res) => {
    const { first_name, last_name, email, password, age, role } = req.body

    const existUser = await userModel.findOne({ email: email })
    existUser && res.send({ status: "error", message: "Ya existe un usuario registrado con ese email" })

    const newUser = { first_name, last_name, email, password, age, role }

    await userModel.create(newUser)

    res.status(201).send({ status: "success", message: "Usuario registrado correctamente", payload: newUser })

})

userRouter.get("/login/", async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email, password })

    !user && res.status(404).send({ status: "error", message: "Usuario no encontrado" })

    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        role: user.role
    }

    res.status(200).send({ status: "success", message: "Usuario logueado correctamente", payload: req.session.user })
})

export default userRouter