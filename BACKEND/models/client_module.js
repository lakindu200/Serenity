import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    _id: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true }
});

const Client = mongoose.model("Client", clientSchema);

export default Client;