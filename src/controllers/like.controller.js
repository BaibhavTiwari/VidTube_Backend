
import mongoose, { isValidObjectId } from "mongoose"
import { like } from "../models/like.model.js"
import { apiError } from "../utils/apiError.js"
import { apiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params

})

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params


})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params

}
)

const getLikedVideos = asyncHandler(async (req, res) => {

})

export {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
  getLikedVideos
}