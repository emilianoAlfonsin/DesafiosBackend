import {fileURLToPath} from 'url'
import { dirname } from 'path'
import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

// Validación en mongoose de id 
export function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id)
}


//Hasheo de contraseñas
export function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

//Validación de contraseñas
export function isValidPassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword)
}