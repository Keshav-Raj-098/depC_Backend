import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/Apierror.js"
import { Application } from "../models/application.model.js"
import { Apiresponse } from "../utils/Apiresponse.js"
import { Student } from "../models/student.model.js"

const createApplication = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, entryNumber, cgpa, branch, affidavit, list } = req.body;

  
    if (!name || !entryNumber || !cgpa || !branch || !list) {
        throw new ApiError(400, "All fields are required");
    }

    try {
       
        const application = await Application.create({ name, entryNumber, cgpa, branch, affidavit, list });
            
        const student = await Student.findByIdAndUpdate(
            id,
            { application: application._id }, // Link the application to the student
            { new: true, runValidators: true }
        );
        if (!student) {
            // Handle case where student is not found
            throw new ApiError(404, "Student not found");
        }
        return res.status(200).json(new Apiresponse(200, student, "Application created successfully"));
    } catch (error) {
  
        throw new ApiError(500, error.message || "Error while creating application");
    }
});


const updateApplication = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, entryNumber, cgpa, branch, affidavit, list} = req.body;
     
    console.log("Hello");
    
    // Create an object with only the fields that are being updated
    const updateFields = {};

    if (name) updateFields.name = name;
    if (entryNumber) updateFields.entryNumber = entryNumber;
    if (cgpa) updateFields.cgpa = cgpa;
    if (branch) updateFields.branch = branch;
    if (affidavit) updateFields.affidavit = affidavit;
    if (list) updateFields.list = list;

    const application = await Application.findByIdAndUpdate(id, updateFields, {
        new: true,           // Return the updated document
        runValidators: true,  // Ensure any validation rules are applied
    });

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new Apiresponse(200, application, "Application updated successfully")
    );
});


const deleteApplication = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Find and delete the application
    const application = await Application.findByIdAndDelete(id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    // Find the student linked to the deleted application and remove the application reference
    await Student.findOneAndUpdate(
        { application: id }, // Find student with the deleted application reference
        { application: null }, // Remove the application link
        { new: true } // Return the updated student document (optional)
    );

    return res.status(200).json(
        new Apiresponse(200, null, "Application deleted successfully")
    );
});



const getApplication = asyncHandler(async (req, res) => {

    const { id } = req.params;

    console.log(id);
    

    // If an ID is provided, find one specific application
  
        const application = await Application.findById(id);

        if (!application) {
            throw new ApiError(404, "Application not found");
        }

        return res.status(200).json(
            new Apiresponse(200, application, "Application retrieved successfully")
        );
    


    
});



export { createApplication,updateApplication,deleteApplication,getApplication }