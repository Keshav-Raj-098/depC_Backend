import mongoose, {Schema} from "mongoose";

const applicationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    cgpa: {
        type: Number,
        required: true,
    },
    hostel: {
        type: String,
        required: true,
    },
    affidavit: {
        type: String,
        required: false,
    },
    list: {
        type: [{ type: String }],
        required: true,
    },

}, { timestamps: true });



export const Application = mongoose.model("Application", applicationSchema);
