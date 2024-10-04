import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/Apierror.js"
import { Application } from "../models/application.model.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { BranchDetails } from "../models/admin.model.js"



const createBranchDetails =  asyncHandler(async (req, res) => {

    const {branchName,currentNumber,allowedPercent,onRoll} = req.body; 


    if (!branchName || !currentNumber || !allowedPercent || !onRoll) {
        throw new ApiError(400, "All fields are required");
    }

    
    try {

        const branch = await BranchDetails.create({branchName,currentNumber,allowedPercent,onRoll})

        if(!branch) {
            throw new ApiError(402,"Error While Creating Branch Details")
        }

        return res.status(200).json(new Apiresponse(200,branch,"Branch Created Successfully"))
        
    } catch (error) {

        throw new ApiError(404,"Server Error")
        
    } 

})

const updateBranchDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { branchName, currentNumber, allowedPercent, onRoll } = req.body;

    if (!id) {
        throw new ApiError(400, "Branch ID is required");
    }

    const updatedData = { branchName, currentNumber, allowedPercent, onRoll };

    try {
        const updatedBranch = await BranchDetails.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedBranch) {
            throw new ApiError(404, "Branch not found");
        }

        return res.status(200).json(new Apiresponse(200, updatedBranch, "Branch updated successfully"));
    } catch (error) {
        throw new ApiError(500, "Server error while updating branch");
    }
});


const deleteBranchDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Branch ID is required");
    }

    try {
        const deletedBranch = await BranchDetails.findByIdAndDelete(id);

        if (!deletedBranch) {
            throw new ApiError(404, "Branch not found");
        }

        return res.status(200).json(new Apiresponse(200, null, "Branch deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Server error while deleting branch");
    }
});



const getAllBranchDetails = asyncHandler(async (req, res, next) => {

    const branches = await BranchDetails.find();

    if (!branches || branches.length === 0) {
        throw new ApiError(404, "No branches found");
    }

    return res.status(200).json(new Apiresponse(200, branches, "Branches retrieved successfully"));
});


const getAllApplicants = asyncHandler(async (req, res, next) => {

    const applications = await Application.find();

    if (!applications || applications.length === 0) {
        throw new ApiError(404, "No Student found");
    }

    return res.status(200).json(new Apiresponse(200, applications, "Branches retrieved successfully"));
});



export {createBranchDetails,updateBranchDetails,deleteBranchDetails,getAllBranchDetails,getAllApplicants}