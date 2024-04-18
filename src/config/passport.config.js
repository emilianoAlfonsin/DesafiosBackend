import passport from "passport"
import local from "passport-local"

import UserModel  from "../dao/models/userModel.js"
import { hashPassword, isValidPassword } from "../utils.js"

const LocalStrategy = local.Strategy

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, username, password, done) => {
                const { first_name, last_name, email, age } = req.body

                try {
                    const user = await UserModel.findOne({ email: username })
                    if (user) {
                        console.log("El ususario ya existe")
                        return done(null, false)
                    }

                    let role = email === "adminCoder@coder.com" ? "admin" : "user"

                    const newUser = {
                        first_name,
                        last_name,
                        email,
                        age,
                        password: hashPassword(password),
                        role
                    }

                    const result = await UserModel.create(newUser)
                    return done(null, result)
                } catch (error) {
                    return done("Error al registrar el usuario")
                }
            }
        )
    )

    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({ email: username })
                    if (!user) {
                        console.log("El usuario no existe")
                        return done(null, false)
                    }

                    if (!isValidPassword(password, user.password)) {
                        console.log("Contraseña incorrecta")
                        return done(null, false)
                    }

                    return done(null, user)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )    

    passport.serializeUser ( (user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser ( async (id, done) => {
        try {
            const user = await UserModel.findById(id)
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

export default initializePassport