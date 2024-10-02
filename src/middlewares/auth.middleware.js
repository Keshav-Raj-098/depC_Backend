import { ApiError } from "../utils/Apierror.js"
import { asyncHandler } from "../utils/asynchandler.js"
import jwt  from "jsonwebtoken"
import { Student } from "../models/student.model.js"

// next used beacause a middleware
// in our following code res has no use so _ used , a production level thing
const verifyjJWT = asyncHandler(async (req, _, next) => {
  try {
      const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
      
      console.log(token);
      
      if (!token) {
          throw new ApiError(401, "Unauthorized Request");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      
      // Await the user retrieval from the database
      const user = await Student.findById(decodedToken?._id).select("-password -refreshToken");
      
      if (!user) {
          throw new ApiError(401, "Invalid Access Token");
      }

      // Attach the user to the request object
      req.user = user;
      next();

  } catch (error) {
      throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export {verifyjJWT}
