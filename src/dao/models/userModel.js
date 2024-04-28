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
    cart: {
        type: Schema.Types.ObjectId,
        ref : 'Carts'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'admin']
    }
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel