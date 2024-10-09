import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/Apierror.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { Application } from "../models/application.model.js"
import { BranchDetails } from "../models/admin.model.js"





const createBranchDetails = asyncHandler(async (req, res) => {

    const { branchName, currentNumber, allowedPercent, onRoll } = req.body;


    if (!branchName || !currentNumber || !allowedPercent || !onRoll) {
        throw new ApiError(400, "All fields are required");
    }


    try {

        const branch = await BranchDetails.create({ branchName, currentNumber, allowedPercent, onRoll })

        if (!branch) {
            throw new ApiError(402, "Error While Creating Branch Details")
        }

        return res.status(200).json(new Apiresponse(200, branch, "Branch Created Successfully"))

    } catch (error) {

        throw new ApiError(404, "Server Error")

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



const getAllBranchDetails = asyncHandler(async (req, res,) => {

    const branches = await BranchDetails.find();

    if (!branches || branches.length === 0) {
        throw new ApiError(404, "No branches found");
    }

    return res.status(200).json(new Apiresponse(200, branches, "Branches retrieved successfully"));
});


const getAllApplicants = asyncHandler(async (req, res,) => {

    const applications = await Application.find();

    if (!applications || applications.length === 0) {
        throw new ApiError(404, "No Student found");
    }

    return res.status(200).json(new Apiresponse(200, applications, "Branches retrieved successfully"));
});

// Controller for branch change

const ChangeBranch = asyncHandler(async (req, res) => {

    const branches = await BranchDetails.aggregate(
        [
            {
                $addFields: {
                    vacantSeats: {
                        $trunc: {
                            $subtract: [
                                {
                                    $multiply: [
                                        { $divide: [{ $add: [100, "$allowedPercent"] }, 100] },
                                        "$currentNumber"
                                    ]
                                },
                                "$onRoll"
                            ]
                        }
                    },
                    min: {
                        $trunc: {
                            $multiply: [
                                { $divide: [{ $subtract: [100, "$allowedPercent"] }, 100] },
                                "$currentNumber"
                            ]
                        }
                    },
                    max: {
                        $trunc: {
                            $multiply: [
                                { $divide: [{ $add: [100, "$allowedPercent"] }, 100] },
                                "$currentNumber"
                            ]
                        }
                    }
                }
            },
            {
                $project: {
                    vacantSeats: 1,
                    min: 1,
                    branchName: 1,
                    max: 1,
                    onRoll: 1
                }
            },

        ]
    )


    const applications = await Application.aggregate([
        {
            $sort: {
                cgpa: -1
            }
        },
        {
            $project: {
                name: 1,
                entryNumber: 1,
                branch: 1,
                list: 1,
                branch: 1,
                newBranch: 1

            }
        }
    ])




    if (!branches || !applications) { throw new ApiError(406, "Pipeline Failed") }





    for (let Index = 0; Index < applications.length; Index++) {
        const applicant = applications[Index];

        const applicantBranch = branches.find((branch) => (branch.branchName === applicant.branch));

        if (applicantBranch?.onRoll <= applicantBranch?.min) { continue; }


        for (let index = 0; index < applicant.list.length; index++) {



            const listBranch = branches.find((branch) =>
                (branch.branchName === applicant.list[index]));




            if (listBranch?.onRoll >= listBranch?.max) { continue; }
            if (listBranch?.vacantSeats <= 0) { continue; }

            applicant.changedTo = listBranch.branchName;

            const updatedApplication = await Application.findOneAndUpdate(
                { _id: applicant._id },  // Find by ID
                { newBranch: listBranch.branchName },  // Update object
                { new: true }  // Return the updated document
            )
            if (!updatedApplication) {
                throw new ApiError(403, "Failed while updating to Database")
            }
            listBranch.vacantSeats -= 1;
            listBranch.onRoll += 1;
            applicantBranch.vacantSeats += 1;
            applicantBranch.onRoll -= 1;

            break;
        }



    }

    const UpdatedApplications = await Application.find().
        select("-list -createdAt -updatedAt -cgpa -affidavit -__v");

    if (!UpdatedApplications) { throw new ApiError(405, "No Updated Application Found") }





    return res.status(200).json(new Apiresponse(200, UpdatedApplications, "Successfull"))





})



// Controller for removeChanges to branch

const removeChanges = asyncHandler(async (req, res) => {

    const removeNewBranch = await Application.updateMany({}, { $set: { newBranch: null } });

    if (!removeNewBranch) { throw new ApiError(407, "changes can't be applied to Database") }

    const updatedApplications = await Application.find()
        .select("-list -createdAt -updatedAt -cgpa -affidavit -__v");


    res.status(200).json(new Apiresponse(200, updatedApplications, "Removed Changes"))
})





















export { createBranchDetails, updateBranchDetails, deleteBranchDetails, getAllBranchDetails, getAllApplicants, ChangeBranch, removeChanges }