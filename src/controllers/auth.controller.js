import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User as userModel } from "../models/user.model.js";
import { Admin as adminModel } from "../models/admin.model.js";
import { Validator } from "../utils/validator.js";
import { UploadImage } from "../utils/cloudinary.js";
import config from "../../config/config.js";
// an image with name avatar in middelware !!
const helperObj = {
  async isExistingUserOrAdmin(dataModel, username, email, mobile) {
    const isExisting = await dataModel.findOne({
      $or: [{ username }, { email }, { mobile }],
    });
    if (isExisting) {
      return {
        code: 409,
        message: `These details like username, email or mobile no. in use, please try login if already registered!`,
      };
    } else return null;
  },
  // handle avatar image: check & upload on cloud
  async avatarHandler(req) {
    let avatarCloud = "";
    const avatarLocal = req?.file?.path;
    if (avatarLocal) {
      avatarCloud = await UploadImage(avatarLocal);
      if (!avatarCloud?.url) {
        console.log(
          "We are facing an issue while uploading image on cloud, sorry!"
        );
      }
      console.log(`avatarCloud: \n${avatarCloud}`);
      return avatarCloud?.url || "";
    }
  },
  emailAndMobileTypeCheck(email, mobile01, mobile02 = null) {
    console.log("in helper obj");
    if (!Validator.isEmail(email)) {
      console.log("email is false");
      return { code: 400, message: `Email id is not proper!` };
    } else if (!Validator.isMobileNumber(mobile01)) {
      return { code: 400, message: `Mobile number is not proper!` };
    } else if (
      !Validator.isEmail(email) ||
      !Validator.isMobileNumber(mobile01) ||
      (mobile02 ? !Validator.isMobileNumber(mobile02) : false)
    ) {
      return {
        code: 400,
        message: `Email id or mobile number is not in proper!`,
      };
    } else return null;
  },
  async generateTokens(
    entity,
    dataForRef,
    secretRef,
    expiryForRef,
    dataForAcc,
    secretAcc,
    expiryForAcc
  ) {
    console.log("in tokengenerater fun for :");
    console.log(entity.username);
    const refreshToken = await entity.methods.generateToken(
      dataForRef,
      secretRef,
      expiryForRef
    );
    const accessToken = await entity.methods.generateToken(
      dataForAcc,
      secretAcc,
      expiryForAcc
    );
    console.log(refreshToken);
    console.log(accessToken);
    return { refreshToken, accessToken };
  },
};
export const Register = asyncHandler(async function (req, res) {
  //Algo:-
  // get init data
  // validate data
  // get avatar & upload to cloudinary
  // create obj to db
  // check for proper save and remove : password and refresh token fields from obj
  // set tokens and cookies
  // send res and tokens

  let role = req.body["role"];
  console.log("In register controller 01: ");
  if (!role || role.trim().length === 0) {
    console.log("role check ");
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          `Please mention role field properly from following: ("admin", "user", "firm")`
        )
      );
  }
  role = String(role).trim();

  switch (role) {
    case "user": {
      console.log("switch user");
      await regUser();
      break;
    }
    case "admin": {
      console.log("switch admin");
      await regAdmin();
      break;
    }
    case "firm": {
      console.log("switch firm");
      await regFirm();
      break;
    }
  }

  // === business logic===
  async function regUser() {
    // get data
    console.log("register user fun begin 03");

    let { fullname, username, email, gender, password, mobile, address } =
      req.body;
    const dataArray = [
      fullname,
      username,
      email,
      gender,
      password,
      mobile,
      address,
    ];
    // validate data
    const isDataEmpty = Validator.testEmptyCheck(dataArray);
    if (isDataEmpty) {
      let { code, message } = isDataEmpty;
      return res.status(code).json(new ApiError(code, message));
    }
    console.log("check for empty data 05");
    // email & mobile no. type check
    fullname = String(fullname.trim());
    username = String(username.trim());
    email = String(email.trim());
    gender = String(gender.trim());
    password = String(password.trim());
    mobile = Number(mobile.trim());
    address = String(address.trim());
    const isEmailOrMobileWrong = helperObj.emailAndMobileTypeCheck(
      email,
      mobile
    );
    if (isEmailOrMobileWrong) {
      console.log("in email mobile checking");
      const { code, message } = isEmailOrMobileWrong;
      console.log(`code ${code}, message ${message}`);
      return res.status(code).json(new ApiError(code, message));
    }
    console.log(
      `check format for email [${email}] & mobile num [${mobile}] 06`
    );

    // existence check
    const isExistingUser = await helperObj.isExistingUserOrAdmin(
      userModel,
      username,
      email,
      mobile
    );
    if (isExistingUser) {
      let { code, message } = isExistingUser;
      return res.status(code).json(new ApiError(code, message));
    }

    console.log(`existence check for ${fullname} 07`);
    // handle image
    const avatarCloud = await helperObj.avatarHandler(req);
    console.log("creating db obj");
    // create database object
    let user = await userModel.create({
      fullname,
      username,
      email,
      gender,
      password,
      mobile,
      address,
      role,
      "avatar": avatarCloud,
    });
    if(!user){
      return res.status(501).json(new ApiError(501,"not good for user register!"))
    }
console.log(user);
    const { refreshToken, accessToken } = await helperObj.generateTokens(
      user,
      { _id: user?._id },
      config.refreshSecret,
      config.refreshExpiry,
      {
        _id: user?._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      config.accessSecret,
      config.accessExpiry
    );

    console.log(`data to be sent for tokens : \n
    dataForRef: \n${{ _id: user?._id }},
    secretRef: \n${config.refreshSecret},
    expiryForRef: \n${config.refreshExpiry},
    dataForAcc: \n${{
      _id: user?._id,
      username: user.username,
      email: user.email,
      role: user.role,
    }},
    secretAcc: \n${config.accessSecret},
    expiryForAcc: \n${config.accessExpiry}\n\n\n`);
    console.log(
      `data saved to db\nrefresh token : ${refreshToken}\naccess token: ${accessToken}`
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    // Is user save properly?
    const savedUser = await userModel
      .findById(user._id)
      .select("-password -refreshToken");
    if (!savedUser) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "auth controller error :: Server is unable to register user due to unknown issues."
          )
        );
    }
    // retrun response with proper tokens in cookies and saved user data
    return res
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .status(201)
      .json(
        new ApiResponse(
          201,
          `${fullname} as ${role} is registered successfully.`,
          savedUser
        )
      );
  }

  function regAdmin() {
    // const { fullname, username, email, gender, password, mobile, address } =
    //   req.body;
    // const dataArray = [
    //   fullname,
    //   username,
    //   email,
    //   gender,
    //   password,
    //   mobile,
    //   address,
    // ];
    res.status(200).json(
      new ApiResponse(200, "we are working of Admin registration!", {
        requestBody: req.body,
        avatar: req.file.path,
      })
    );
  }
  function regFirm() {
    // const {
    //   name,
    //   address,
    //   GSTNum,
    //   dealingIn,
    //   licenseType,
    //   licenseNum,
    //   email,
    //   mobile01,
    //   mobile02,
    //   UHBVNGSTNum,
    //   extraPremiumCharges,
    // } = req.body;
    // const dataArray = [
    //   name,
    //   address,
    //   GSTNum,
    //   dealingIn,
    //   licenseType,
    //   licenseNum,
    //   email,
    //   mobile01,
    //   mobile02,
    //   UHBVNGSTNum,
    //   extraPremiumCharges,
    // ];
    res.status(200).json(
      new ApiResponse(200, "we are working of Firm registration!", {
        requestBody: req.body,
        avatar: req.file.path,
      })
    );
  }
});
