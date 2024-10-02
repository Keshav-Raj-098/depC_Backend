import { Router } from "express";
import { createApplication,updateApplication,deleteApplication,getApplication } from "../controllers/application.contoller.js"

const router = Router();

router.route("/create/:id").post(createApplication)
router.route("/read/:id").get(getApplication)
router.route("/update/:id").post(updateApplication)
router.route("/delete/:id").post(deleteApplication)





export default router