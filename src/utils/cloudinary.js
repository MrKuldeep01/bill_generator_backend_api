import { v2 as cloudinary } from "cloudinary";
import config from "../../config/config.js";
import fs from "fs";
// Configuration
cloudinary.config({
  cloud_name: config.cloudName,
  api_key: config.apiKey,
  api_secret: config.apiSecret,
});

export const UploadImage = async function (filePath) {
  try {
    if (!filePath) return null;

    const uploadObj = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });
    console.log("file uploaded successfully...:)");
    fs.unlinkSync(filePath);
    return uploadObj;
  } catch (error) {
    console.error(`Error while playing with file: ${error}`);
    fs.unlinkSync(filePath);
  }
};
