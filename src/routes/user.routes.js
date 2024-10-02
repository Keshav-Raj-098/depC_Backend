import { Router } from "express";
import { verifyjJWT } from "../middlewares/auth.middleware.js";
import {
    registerUser, loginUser, logOutUser,
    refreshAccessToken, changeCurrentPassword, getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"


const router = Router();


router.route("/").get(getCurrentUser)
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout/:id").post(logOutUser)
router.route("/refreshtoken").post(verifyjJWT,refreshAccessToken)
router.route("/changepassword").post(verifyjJWT, changeCurrentPassword)
router.route("/currentuser").get(verifyjJWT, getCurrentUser)






export default router;