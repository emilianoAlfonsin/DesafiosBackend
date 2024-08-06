import mongoose from "mongoose";
import { Schema } from "mongoose";

const userCollection = 'users';

const userSchema = new Schema(
    {
        first_name: {
            type: String,
            required: [true, "El campo 'first_name' es obligatorio"],
            trim: true
        },
        last_name: {
            type: String,
            required: [true, "El campo 'last_name' es obligatorio"],
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, "El campo 'email' es obligatorio"],
            trim: true,
            match: [/.+\@.+\..+/, "Por favor ingrese un correo electrónico válido"]
        },
        password: {
            type: String,
            required: [true, "El campo 'password' es obligatorio"]
        },
        age: {
            type: Number,
            min: [0, "La edad no puede ser negativa"]
        },
        cart: {
            type: Schema.Types.ObjectId,
            ref: 'Carts'
        },
        role: {
            type: String,
            enum: ['user', 'premium', 'admin'],
            default: 'user'
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        documents: [
            {
                name: {
                    type: String,
                    required: [true, "El campo 'name' es obligatorio"]
                },
                reference: {
                    type: String,
                    required: [true, "El campo 'reference' es obligatorio"]
                }
            }
        ],
        last_connection: Date
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt
    }
);

// Agregar un índice para el campo 'email' para mejorar el rendimiento de las consultas
userSchema.index({ email: 1 });

const userModel = mongoose.model(userCollection, userSchema);
export default userModel;