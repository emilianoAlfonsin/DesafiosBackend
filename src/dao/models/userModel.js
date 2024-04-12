import mongoose from "mongoose"
import { Schema } from "mongoose"

const userCollection = 'users'

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    password: String,
    age: Number,
    role: {
        type: String,
        default: 'user'
    }
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel