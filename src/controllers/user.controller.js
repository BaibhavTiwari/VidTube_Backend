import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body
  console.log("email :", email);
  if (
    [fullname, email, password, username].some((field) =>
      field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are compulsory..")
  }

})
export { registerUser }