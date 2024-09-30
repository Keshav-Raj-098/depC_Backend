import { asyncHandler } from "../utils/asynchandler.js"
import { ApiError } from "../utils/Apierror.js"
import { Application } from "../models/application.model.js"
import { Apiresponse } from "../utils/Apiresponse.js"

const createApplication = asyncHandler(async (req, res) => {

    const { name, email, cgpa, hostel, affidavit, list, } = req.body


    const application = await Application.create({ name, email, cgpa, hostel, list })

    if (!application) {
        throw new ApiError(408, "Error While creating application")
    }


    return res.status(201).json(
        new Apiresponse(200, application, "Application created successfully")
    )
})


const updateApplication = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { name, email, cgpa, hostel, affidavit, list} = req.body;
     
    console.log("Hello");
    
    // Create an object with only the fields that are being updated
    const updateFields = {};

    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (cgpa) updateFields.cgpa = cgpa;
    if (hostel) updateFields.hostel = hostel;
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
    
    console.log(req);
    const { id } = req.params;

    

    const application = await Application.findByIdAndDelete(id);

    if (!application) {
        throw new ApiError(404, "Application not found");
    }

    return res.status(200).json(
        new Apiresponse(200, null, "Application deleted successfully")
    );
});


const getApplication = asyncHandler(async (req, res) => {

    const { id } = req.params;

    console.log(id);
    

    // If an ID is provided, find one specific application
    if (id) {
        const application = await Application.findById(id);

        if (!application) {
            throw new ApiError(404, "Application not found");
        }

        return res.status(200).json(
            new Apiresponse(200, application, "Application retrieved successfully")
        );
    }

    // If no ID is provided, retrieve all applications
    const applications = await Application.find();

    return res.status(200).json(
        new Apiresponse(200, applications, "Applications retrieved successfully")
    );
});



export { createApplication,updateApplication,deleteApplication,getApplication }