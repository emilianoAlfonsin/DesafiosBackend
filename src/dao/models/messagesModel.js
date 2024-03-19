import mongoose from "mongoose";
import { Schema } from "mongoose";

const collection = "Messages"
const schema = new Schema({
    user: {type: String, required: true},
    message: {type: String, required: true}
})

const messageModel = mongoose.model(collection, schema)
export default messageModel