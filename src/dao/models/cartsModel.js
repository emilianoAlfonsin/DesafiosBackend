import mongoose from "mongoose";
import { Schema } from "mongoose";

const collection = "Carts";

const schema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "Users",
            required: [true, "El campo 'owner' es obligatorio"]
        },
        products: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Products",
                    required: [true, "El campo 'product' es obligatorio"]
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: [true, "El campo 'quantity' es obligatorio"],
                    min: [1, "La cantidad mínima es 1"]
                },
            },
        ],
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt
    }
);

// Agregar un índice para el campo 'owner' para mejorar el rendimiento de las consultas
schema.index({ owner: 1 });

const cartsModel = mongoose.model(collection, schema);
export default cartsModel;