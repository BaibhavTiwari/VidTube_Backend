import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.models.js"
import apiError from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Comment } from "../models/comment.model.js"
import { Like } from "../models/like.model.js"
import { Playlist } from "../models/playlist.model.js"

const isUserOwner = async (videoId, req) => {
}

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1,
    limit = 10,
    query,
    sortBy,
    sortType,
    userId } = req.query;


  page = parseInt(page, 10);
  limit = parseInt(limit, 10);


  page = Math.max(1, page); // Ensure page is at least 1
  limit = Math.min(20, Math.max(1, limit)); // Ensure limit is between 1 and 20

  const pipeline = [];


  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new apiError(400, "userId is invalid");
    }

    pipeline.push({
      $match: {
        owner: mongoose.Types.ObjectId(userId)
      }
    });
  }


  if (query) {
    pipeline.push({
      $match: {
        $text: {
          $search: query
        }
      }
    });
  }


  const sortCriteria = {};
  if (sortBy && sortType) {
    sortCriteria[sortBy] = sortType === "asc" ? 1 : -1;
    pipeline.push({
      $sort: sortCriteria
    });
  } else {

    sortCriteria["createdAt"] = -1;
    pipeline.push({
      $sort: sortCriteria
    });
  }


  pipeline.push({
    $skip: (page - 1) * limit
  });
  pipeline.push({
    $limit: limit
  });


  const Videos = await Video.aggregate(pipeline);

  if (!Videos || Videos.length === 0) {
    throw new apiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Videos, "Videos fetched Successfully"));
});


const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body

  if (!title || !description) {
    throw new apiError("Title and description both are required !")
  }


  const videolocalpath = req.files?.videoFile[0]?.path;
  const thumbnaillocalpath = req.files?.thumbnail[0]?.path;

  if (!videolocalpath) {
    throw new apiError(404, "Video is required!!!")
  }
  if (!thumbnaillocalpath) {
    throw new apiError(404, "Thumbnail is required!!!")
  }

  const video = await uploadOnCloudinary(videolocalpath);
  const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);

  if (!video?.url) {
    throw new apiError(500, "Something wrong happens while uplaoding the video")
  }
  if (!thumbnail?.url) {
    throw new apiError(500, "Something wrong happens while uplaoding the thumbnail")
  }

  const newVideo = await Video.create({
    videoFile: video?.url,
    thumbnail: thumbnail?.url,
    title,
    description,
    duration: video?.duration,
    isPublished: true,
    owner: req.user?._id
  })

  return res
    .status(200)
    .json(new ApiResponse(200, newVideo, "Video Published Successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId) {
    throw new apiError(404, "videoId is Required")
  }
  const video = await Video.findById(videoId)


  if (!video || (!video?.isPublished && !(video?.owner.toString() === req.user?._id.toString()))) {
    throw new apiError(404, "Video not found")
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched Successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  if (!videoId) {
    throw new apiError(404, "videoId is required !!!")
  }
  const video = await Video.findById(videoId);

  if (!video) {
    throw new apiError(404, "Video doesnt exist")
  }
  const authorized = await isUserOwner(videoId, req)

  if (!authorized) {
    throw new ApiError(300, "Unauthorized Access")
  }
  const { title, description } = req.body;
  if (!title || !description) {
    throw new ApiError(404, "Title or Description is required!!!")
  }
  const thumbnaillocalpath = req.file?.path;

  const thumbnail = await uploadOnCloudinary(thumbnaillocalpath);
  if (!thumbnail?.url) {
    throw new ApiError(400, "Something went wrong while updating the thumbnail")
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId,
    {
      $set: {
        title: title,
        description: description,
        thumbnail: thumbnail?.url
      }
    }, {
    new: true
  })

  if (!updatedVideo) {
    throw new ApiError(500, "Something went wrong while updating the details")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "Video Updated Successfully"));

})

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId) {
    throw new ApiError(404, "videoId is required !!!")
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video doesnt exist")
  }
  const authorized = await isUserOwner(videoId, req)
  if (!authorized) {
    throw new ApiError(300, "Unauthorized Access")
  }

  const videoDeleted = await Video.findByIdAndDelete(videoId);

  await Comment.deleteMany({ video: videoId })
  await Like.deleteMany({ video: videoId })

  const playlists = await Playlist.find({ videos: videoId })
  for (const playlist of playlists) {
    await Playlist.findByIdAndUpdate(
      playlist._id,
      {
        $pull: { videos: videoId }
      },
      {
        new: true
      }
    )
  }

  if (!videoDeleted) {
    throw new ApiError(400, "Something error happened while deleting the video")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Video Deleted Successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params

  if (!videoId) {
    throw new ApiError(404, "videoId is required !!!")
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const authorized = await isUserOwner(videoId, req)
  if (!authorized) {
    throw new ApiError(300, "Unauthorized Access")
  }

  const updatedVideo = await Video.findByIdAndUpdate(videoId,
    {
      $set: {
        isPublished: !video.isPublished

      }
    },
    { new: true })
  if (!updatedVideo) {
    throw new ApiError(500, "Something went wrong while toggling the status")
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, " PublishStatus of the video  is toggled successfully"))



})

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
}