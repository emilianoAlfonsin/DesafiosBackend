import mongoose from "mongoose";
import { Schema } from "mongoose";

const ticketCollection = 'tickets';

const ticketSchema = new Schema(
    {
        code: {
            type: String,
            required: [true, "El campo 'code' es obligatorio"],
            unique: true,
            trim: true
        },
        purchase_datetime: {
            type: Date,
            required: [true, "El campo 'purchase_datetime' es obligatorio"]
        },
        amount: {
            type: Number,
            required: [true, "El campo 'amount' es obligatorio"],
            min: [0, "El monto no puede ser negativo"]
        },
        purchaser: {
            type: String,
            required: [true, "El campo 'purchaser' es obligatorio"],
            trim: true
        }
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt
    }
);

// Agregar un índice para el campo 'code' para mejorar el rendimiento de las consultas
ticketSchema.index({ code: 1 });

const ticketModel = mongoose.model(ticketCollection, ticketSchema);
export default ticketModel;