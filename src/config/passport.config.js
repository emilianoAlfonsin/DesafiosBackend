import passport from "passport"
import local from "passport-local"
import GitHubStrategy from "passport-github2"

import UserModel  from "../dao/models/userModel.js"
import { hashPassword, isValidPassword } from "../utils/utils.js"

import SessionService from "../dao/services/session.service.js"
import logger from "../utils/logger.js"

const LocalStrategy = local.Strategy

const sessionService = new SessionService()

const initializePassport = () => {

    // Estrategia local de registro de usuarios.
    // passport.use(
    //     "register",
    //     new LocalStrategy(
    //         { passReqToCallback: true, usernameField: "email" },
    //         async (req, username, password, done) => {
    //             const { first_name, last_name, email, age } = req.body

    //             try {
    //                 const user = await UserModel.findOne({ email: username })
    //                 if (user) {
    //                     logger.error("El ususario ya existe")
    //                     return done(null, false, {message: "El usuario ya existe"})
    //                 }
                    
    //                 let role = email === "adminCoder@coder.com" ? "admin" : "user"
                    
    //                 // Se crea el usuario sin carrito asignado
    //                 const newUser = new UserModel({
    //                     first_name,
    //                     last_name,
    //                     email,
    //                     age,
    //                     password: hashPassword(password),
    //                     role
    //                 })
                    
    //                 // Guardo el usuario para obtener su id
    //                 const savedUser = await newUser.save()
    //                 logger.info("Usuario creado", savedUser)

    //                 // Creo el carrito para el usuario
    //                 const cart = await cartService.createCart(savedUser._id)// Asigno el id del usuario al carrito
    //                 logger.info("Carrito creado", cart)

    //                 savedUser.cart = cart._id // Asigno el id del carrito al usuario

    //                 // Guardo el usuario con el carrito asignado
    //                 const result = await savedUser.save()
    //                 logger.info("Usuario con carrito asignado", result)
                    
    //                 return done(null, result)
    //             } catch (error) {
    //                 logger.error("Error al registrar el usuario" + error)
    //                 return done("Error al registrar el usuario")
    //             }
    //         }
    //     )
    // )
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, email, password, done) => {
                const { first_name, last_name, age } = req.body

                try {
                    // Llamada al método registerUser de SessionService
                    const user = await sessionService.registerUser({
                        first_name,
                        last_name,
                        email,
                        age,
                        password,
                    })

                    return done(null, user)
                } catch (error) {
                    logger.error(`Error al registrar el usuario: ${error}`)
                    return done(error)
                }
            }
        )
    )

    // Estrategia local de login de usuarios.
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

    // Estrategia de GitHub.
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: "Iv1.47d8f43adbe04b52",
                clientSecret: "652bab73dd9cf76aaa83a294af19c8e8f32b907d",
                callbackURL: "http://localHost:8080/api/session/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await UserModel.findOne({ email: profile._json.email })
                    if (user) {
                        console.log("El usuario ya existe")
                        return done(null, user)
                    }

                    const newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        email: profile._json.email,
                        age: 18,
                        password: "",
                        role: "user"
                    }
                    

                    const result = await UserModel.create(newUser)
                    return done(null, result)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )


    // Serializacion y deserializacion de usuarios.
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id)
            if (!user) {
                return done(new Error("Usuario no encontrado"))
            }
            done(null, user)
        } catch (error) {
            done(error)
        }
    })
}

export default initializePassport