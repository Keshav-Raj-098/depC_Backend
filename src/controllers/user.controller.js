import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/Apierror.js"
import { Student } from "../models/student.model.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"


const generateAccessTokenAndRefreshToken = async (userId) => {
    try {

        const user = await Student.findById(userId)
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        //    generateRefreshToken & generateAccessToken are methods so '()' are used

        user.refreshToken = refreshToken
        // the following thing is false because whenever we use save the schema matches the structure that is will match that all fields like password ,email etc are valid/present or not here we dont want that as it is of no need
        await user.save({ validateBeforeSave: false })



        return { accessToken, refreshToken }
    }
    catch {
        throw new ApiError("500", "something went wrong while generating token")
    }
}


const registerUser = asyncHandler(async (req, res) => {

    // the inner element should be same as we defined in user.modal
    const { email, username, password } = req.body




  
    if (
        [ email, username, password].some((field) => {
            field?.trim() === ""
        })
    ) {
        throw new ApiError(400, "All fields are required")

    }

    // [3] check if user already exist

    // findone method used find the string of all user name available in Userschema,or used if any of them is found similarly you can use comment,text etc

    // findone return the first entry which it get
    const existeduser = await Student.findOne({
        $or: [{ username }, { email }],

    })

    if (existeduser) {
        throw new ApiError(409, "username/email already  exists")
    }

 

    const user = await Student.create({email
        ,password,
        username: username?.toLowerCase(),
        application:  null
    })



    // [7]    remove password & refresh token field from response 

    const createduser = await Student.findById(user._id).select("-password -refreshToken")


    // [8]  check for user creation

    if (!createduser) {
        throw new ApiError(500, "Something went wrong whille registering the user")
    }
    // [9] return res

    return res.status(200).json(
        new Apiresponse(200, createduser, "Student registered successfully")
    )

})




// LOGIN CONTROLLER

const loginUser = asyncHandler(async (req, res) => {


    // [1] get the input(eiter username or email)

    const { username,password } = req.body

    if (!username && !password) {
        throw new ApiError(400, "username or password is required")
    }

    // [2] find the user
    const user = await Student.findOne({username })

    if (!user) {
        throw new ApiError(404, "Student doesn't Exist")
    }


    //    [3] checking the password

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalis user credentials")
    }

    //   [4]
    // token generator function defined above (after import) 
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)


  console.log({ accessToken, refreshToken } );
  

    const loggedInuser = await Student.findById(user._id).select("-password-refreshToken")

    // [5]
    
    const options = {
        httpOnly: true,     // Ensures the cookie is not accessible via JavaScript
        secure: false,      // Set to false during local development, true in production over HTTPS
        sameSite: 'None',   // Allows cross-site requests (necessary for different ports/domains)
      };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new Apiresponse(200, {
                loggedInuser,accessToken,
                refreshToken
            },
                "Student Logged in successfully"


            ))
})

const logOutUser = asyncHandler(async (req, res) => {

    const { id } = req.params;

    // user jab logout kar raha hai tab ham log uska refresh token delete/undefine karwa rhe hai aur jab user login karega to vo do no token fir se generate ho sakte hai


    await Student.findByIdAndUpdate(id,

        {
            $unset: {
                refreshToken: 1 //this removes the field from document
            }

        }
    )

    const options = {
        // httponly true means modifiable only by server
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new Apiresponse(200, {}, "Student logged Out"))

})


// new accesstoken  generator using refreshtoken

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incommingrefreshToken = req.cookies.refreshToken || req.body.refreshToken


    if (!incommingrefreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    let decodedtoken;

    try {

        decodedtoken = jwt.verify(
            incommingrefreshToken, process.env.REFRESH_TOKEN_SECRET
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid Refresh Token")

    }

    const user = await Student.findById(decodedtoken?._id)

    if (!user) {
        throw new ApiError(401, "Invalid refresh token")
    }

    if (incommingrefreshToken !== user?.refreshToken) {
        throw new ApiError(401, "Refresh Token is Expired")
    }

    const options = {

        httpOnly: true,
        secure: true
    }

    const { accessToken, newRefreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new Apiresponse(
                200,
                { accessToken, refreshToken: newRefreshToken }
            ))
})



// WRITING UPDATE CONTROLLER



const changeCurrentPassword = asyncHandler(async (req, res) => {


    const { oldPassword, newPassword } = req.body


    // this middleware runs after the auth middleware so the request has user
    const user = await Student.findById(req?.user._id)

    // ispasswordCorrect is a method made in usermodel to verify a string with bcrtpted password 
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password")

    }

    user.password = newPassword
    await user.save({ validateBeforeSave: false })

    return res.status(200)
        .json(
            new Apiresponse(200, {}, "Password changed Successfully")
        )



})

//  this middleware runs after the auth middleware so the request has user
const getCurrentUser = asyncHandler(async (req, res) => {
   
    if (!req.user) {
        throw new ApiError(400, "User not found");
    }

    console.log("this is me :-", req.user);

   
    return res.status(200).json(
        new Apiresponse(200,req.user,
        "Student Fetched successfully"


    ));
});




export {
    registerUser, loginUser, logOutUser,
    refreshAccessToken, changeCurrentPassword, getCurrentUser,
}