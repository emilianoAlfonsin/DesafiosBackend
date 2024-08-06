import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";

import UserModel from "../dao/models/userModel.js";
import { hashPassword, isValidPassword } from "../utils/utils.js";

import SessionService from "../services/session.service.js";
import logger from "../utils/logger.js";

const LocalStrategy = local.Strategy;

const sessionService = new SessionService();

const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
            { passReqToCallback: true, usernameField: "email" },
            async (req, email, password, done) => {
                const { first_name, last_name, age } = req.body;

                try {
                    // Llamada al método registerUser de SessionService
                    const user = await sessionService.registerUser({
                        first_name,
                        last_name,
                        email,
                        age,
                        password,
                    });

                    return done(null, user);
                } catch (error) {
                    logger.error(`Error al registrar el usuario: ${error}`);
                    return done(error);
                }
            }
        )
    );

    // Estrategia local de login de usuarios.
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            async (username, password, done) => {
                try {
                    const user = await UserModel.findOne({ email: username });
                    if (!user) {
                        logger.error("El usuario no existe");
                        return done(null, false, { message: "El usuario no existe" });
                    }

                    if (!isValidPassword(password, user.password)) {
                        logger.error("Contraseña incorrecta");
                        return done(null, false, { message: "Contraseña incorrecta" });
                    }

                    // Actualizamos el último acceso del usuario.
                    user.last_connection = new Date();
                    await user.save();

                    return done(null, user);
                } catch (error) {
                    logger.error(`Error en la estrategia de login: ${error}`);
                    return done(error);
                }
            }
        )
    );

    // Estrategia de GitHub.
    passport.use(
        "github",
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: "https://localhost:8080/api/session/githubcallback",
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    // Verificar que el correo electrónico esté disponible y verificado
                    if (!profile._json.email) {
                        logger.error("El correo electrónico no está disponible en el perfil de GitHub");
                        return done(null, false, { message: "El correo electrónico no está disponible en el perfil de GitHub" });
                    }

                    const user = await UserModel.findOne({ email: profile._json.email });
                    if (user) {
                        // Actualizamos el último acceso del usuario.
                        user.last_connection = new Date();
                        await user.save();

                        logger.info("El usuario ya existe");
                        return done(null, user);
                    }

                    const newUser = {
                        first_name: profile._json.name || profile.username,
                        last_name: "",
                        email: profile._json.email,
                        password: "",
                        role: "user",
                        last_connection: new Date()
                    };

                    const result = await UserModel.create(newUser);
                    return done(null, result);
                } catch (error) {
                    logger.error(`Error en la estrategia de GitHub: ${error}`);
                    return done(error);
                }
            }
        )
    );

    // Serialización y deserialización de usuarios.
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                return done(new Error("Usuario no encontrado"));
            }
            done(null, user);
        } catch (error) {
            logger.error(`Error al deserializar el usuario: ${error}`);
            done(error);
        }
    });
};

export default initializePassport;