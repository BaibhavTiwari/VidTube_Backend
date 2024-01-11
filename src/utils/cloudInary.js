import { v2 as cloudinary } from "cloudinary";
import { response } from "express";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadCloudinary = async (LocalFilePath) => {
  try {
    if (!LocalFilePath) return null
    cloudinary.uploader.upload(LocalFilePath, {
      resource_type: "auto"
    })
    console.log("Fileis uploaded on Cloudinary...", resource.url);
    return response;

  } catch (error) {
    fs.unlinkSync(LocalFilePath)  //removing the locally saved temporary file
    return null;
  }
}


export { uploadCloudinary }