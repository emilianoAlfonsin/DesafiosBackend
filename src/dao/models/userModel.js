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
        enum: ['user','premium','admin'],
        default: 'user'
        },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    documents: [
        {
            name: String,
            reference: String
        }
    ],
    last_connection: Date
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel