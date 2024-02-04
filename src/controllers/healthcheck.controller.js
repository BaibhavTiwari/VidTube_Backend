import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Server is healthy!!"));
})

export {
  healthcheck
}