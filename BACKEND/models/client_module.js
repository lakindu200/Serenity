import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        trim: true
    },
    email: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    phone: { 
        type: String,
        required: true,
        trim: true
    },
    address: { 
        type: String, 
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Client', clientSchema);