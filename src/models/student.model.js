import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken" 
import bcrypt from "bcrypt"

const studentSchema = new Schema({

    username:{
        type: String,
        required: true,
        unique: true,  
        lowercase: true,
        trim:true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
    },
    password:{
        type: String,
        required:[true,'password is required']
    },
    refreshToken:{
        type: String //just long strings

    }

},{timestamps: true})



// using a middleware so next is used
studentSchema.pre("save",async function(next){
    if(this.isModified("password"))  {
        this.password = await bcrypt.hash(this.password,10)
    }
    next()
})





// using Methods
studentSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}


// jwt doesn't take much more time to generate token so async& await  not  used
studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
        _id:this._id,
       username: this.username,
       email:this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }


)
}
studentSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
        _id:this._id,
       username: this.username,
       email:this.email,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}
export const Student = mongoose.model("Student",studentSchema)