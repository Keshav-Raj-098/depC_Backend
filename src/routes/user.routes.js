import { Router } from "express";
import {
    registerUser, loginUser, logOutUser,
    refreshAccessToken, changeCurrentPassword, getCurrentUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyjJWT } from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyjJWT, logOutUser)
router.route("/refreshtoken").post(refreshAccessToken)
router.route("/changepassword").post(verifyjJWT, changeCurrentPassword)
router.route("/currentuser").get(verifyjJWT, getCurrentUser)






export default router;