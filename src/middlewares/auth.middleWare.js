import { asyncHandler } from "../utils/asyncHandler"
import { apiError } from "../utils/apiError"
import { jwt } from "jsonwebtoken"
import { User } from "../models/user.models"


export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")

    if (!token) {
      throw new apiError(401, "Unauthorized Token")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      throw new apiError(401, "Invalid Acess Token")
    }

    req.user = user;
    next()
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid Acess Token")
  }

})


