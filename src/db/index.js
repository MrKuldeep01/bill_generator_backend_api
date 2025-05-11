import mongoose from "mongoose";
import { DB_name } from "../constant.js";
import config from "../../config/config.js" 
async function connectToDB() {
  try {
    let connection = await mongoose.connect(`${config.dbUri}/${DB_name}`);
    console.log(`Application is connected to Database : ${connection.connection.name} !`);
  } catch (error) {
    console.error("Error in DB connection : ", error);
    process.exit(1);
  }
}
export default connectToDB