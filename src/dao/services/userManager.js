import userModel from "../models/userModel";


export default class UserManager {

    // Crear un usuario.
    async createUser(user) {
        try {
            const userCreated = await userModel.create(user);
            return userCreated;
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener un usuario.
    async getUser(email) {
        try {
            const user = await userModel.findOne({ email: email });
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    // Obtener todos los usuarios.
    async getUsers() {
        try {
            const users = await userModel.find();
            return users;
        } catch (error) {
            console.log(error);
        }
    }
}