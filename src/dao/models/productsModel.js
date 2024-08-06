import mongoose from "mongoose";
import { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsCollection = "Products";

const schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "El campo 'title' es obligatorio"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "El campo 'description' es obligatorio"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "El campo 'price' es obligatorio"],
            min: [0, "El precio no puede ser negativo"]
        },
        thumbnail: {
            type: String,
            required: [true, "El campo 'thumbnail' es obligatorio"],
            trim: true
        },
        code: {
            type: String,
            required: [true, "El campo 'code' es obligatorio"],
            unique: true,
            trim: true
        },
        stock: {
            type: Number,
            required: [true, "El campo 'stock' es obligatorio"],
            min: [0, "El stock no puede ser negativo"]
        },
        status: {
            type: Boolean,
            required: [true, "El campo 'status' es obligatorio"],
            default: true
        },
        category: {
            type: String,
            required: [true, "El campo 'category' es obligatorio"],
            trim: true
        },
        owner: {
            type: String,
            default: "admin",
            trim: true
        }
    },
    {
        timestamps: true, // Agrega createdAt y updatedAt
    }
);

// Agregar un índice para el campo 'code' para mejorar el rendimiento de las consultas
schema.index({ code: 1 });

schema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productsCollection, schema);
export default productsModel;

