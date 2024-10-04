import mongoose, { Schema } from "mongoose";


const adminScema = new Schema({

    userId: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'password is required']
    },
})


const branchDetails = new Schema({

    branchName: {
        type: String,
        required: true,
        unique: true

    },
    currentNumber: {
        type: Number,
        required: true,
    },
    allowedPercent: {
        type: Number,
        required: true
    },
    onRoll: {
        type: Number,
        default: 0,
        
    }

}, { timestamps: true })


export const BranchDetails = mongoose.model("BranchDetails", branchDetails)