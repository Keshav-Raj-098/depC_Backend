import mongoose, {Schema} from "mongoose";

const applicationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    entryNumber: {
        type: String,
        unique: true,
        trim: true,
    },
    cgpa: {
        type: Number,
        required: true,
        min: 0,  
        max: 10,
    },
    branch: {
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
    newBranch:{
        type: String,
        required: false,
        default:null
    }

}, { timestamps: true });



export const Application = mongoose.model("Application", applicationSchema);
