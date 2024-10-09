import { Router } from "express";
import  {createBranchDetails,updateBranchDetails,deleteBranchDetails,getAllBranchDetails,getAllApplicants, ChangeBranch, removeChanges} from "../controllers/branchDetails.controller.js"

const router = Router();

router.route("/create").post(createBranchDetails)
router.route("/update/:id").patch(updateBranchDetails)
router.route("/delete/:id").delete(deleteBranchDetails)
router.route("/readall").get(getAllBranchDetails)
router.route("/readallApplicants").get(getAllApplicants)



router.route("/applyChange").get(ChangeBranch)
router.route("/removeChange").get(removeChanges)
export default router