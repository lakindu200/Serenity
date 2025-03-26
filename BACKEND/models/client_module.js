import mongoose from "mongoose";
const Schema = mongoose.Schema;

const clientDetailsSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true }, // Match product ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
});

const ClientDetails = mongoose.model("ClientDetails", clientDetailsSchema);

export default clientDetailsSchema;