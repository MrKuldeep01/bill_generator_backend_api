import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import { User as userModel } from "../models/user.model.js";
import { Admin as adminModel } from "../models/admin.model.js";
import { Firm as firmModel } from "../models/firm.model.js";
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
  async avatarHandler(requestObject) {
    let avatarCloud = "";
    const avatarLocal = requestObject?.file?.path;
    if (avatarLocal) {
      avatarCloud = await UploadImage(avatarLocal);
      if (!avatarCloud?.url) {
        console.log(
          "We are facing an issue while uploading image on cloud, sorry!"
        );
      }
      console.log("Avatar uploaded to Cloudinary");
      return avatarCloud?.url || "";
    }
  },
  emailAndMobileTypeCheck(email, mobile01, mobile02 = null) {
    if (!Validator.isEmail(email)) {
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
    const refreshToken = entity.generateToken(
      dataForRef,
      secretRef,
      expiryForRef
    );
    const accessToken = entity.generateToken(
      dataForAcc,
      secretAcc,
      expiryForAcc
    );
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
  if (!role || role.trim().length === 0) {
    return res
      .status(400)
      .json(
        new ApiError(
          400,
          `Please mention role field properly from following: ("admin", "user", "firm")`
        )
      );
  }
  role = String(role.trim());
  console.log("Register API called with role:", role);
  switch (role) {
    case "user": {
      await regUser();
      break;
    }
    case "admin": {
      await regAdmin();
      break;
    }
    case "firm": {
      await regFirm();
      break;
    }
  }

  // === business logic===
  async function regUser() {
    // get data
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
    fullname = String(fullname.trim());
    username = String(username.trim());
    email = String(email.trim());
    gender = String(gender.trim());
    password = String(password.trim());
    mobile = Number(mobile.trim());
    address = String(address.trim());
    console.log(
      `New visiter to registere: ${fullname} with username: (${username}) as ${role} from [address: ${address}] ${
        gender == "F" ? ". She is" : ". He is"
      } having following email: ${email}`
    );
    // email & mobile no. type check
    const isEmailOrMobileWrong = helperObj.emailAndMobileTypeCheck(
      email,
      mobile
    );
    if (isEmailOrMobileWrong) {
      const { code, message } = isEmailOrMobileWrong;
      return res.status(code).json(new ApiError(code, message));
    }
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
    // handle image
    const avatarCloud = await helperObj.avatarHandler(req);

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
      avatar: avatarCloud,
    });
    if (!user) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Server is facing an issue while registeration for " + username
          )
        );
    }

    console.log(`${user?.fullname} saved successfully with ID: ${user?._id}`);

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
    if (!(refreshToken && accessToken)) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Server is facing some issues in authenticating you~!`
          )
        );
    }
    console.log(
      `Generated access and refresh tokens for user: ${user?.username}`
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
            "Auth controller error :: Server is unable to register user due to unknown issues. Please contact to developer team!"
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

  async function regAdmin() {
    // get data from body inside request object
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
    // validate for empty fields
    const isDataEmpty = Validator.testEmptyCheck(dataArray);
    if (isDataEmpty) {
      const { code, message } = isDataEmpty;
      return res.status(code).json(new ApiError(code, message));
    }
    //type safety
    fullname = String(fullname.trim());
    username = String(username.trim());
    email = String(email.trim());
    gender = String(gender.trim());
    password = String(password.trim());
    mobile = Number(mobile.trim());
    address = String(address.trim());
    console.log(
      `New visiter to registere: ${fullname} with username: (${username}) as ${role} from [address: ${address}] ${
        gender == "F" ? ". She is" : ". He is"
      } having following email: ${email}`
    );
    // email and mobile type check
    const isEmailOrMobileWrong = helperObj.emailAndMobileTypeCheck(
      email,
      mobile
    );
    if (isEmailOrMobileWrong) {
      const { code, message } = isEmailOrMobileWrong;
      return res.status(code).json(new ApiError(code, message));
    }
    // existence check
    const isExistingAdmin = await helperObj.isExistingUserOrAdmin(
      adminModel,
      username,
      email,
      mobile
    );
    if (isExistingAdmin) {
      const { code, message } = isExistingAdmin;
      return res.status(code).json(new ApiError(code, message));
    }
    // handle avatar image
    const avatar = await helperObj.avatarHandler(req);
    // hit database entry
    const admin = await adminModel.create({
      fullname,
      username,
      email,
      gender,
      role,
      password,
      mobile,
      avatar,
      address,
    });
    if (!admin) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Auth controller :: Server is facing unknown issue during registeration for ${fullname}`
          )
        );
    }
    // generate tokens and save
    const { refreshToken, accessToken } = await helperObj.generateTokens(
      admin,
      {
        _id: admin._id,
      },
      config.refreshSecret,
      config.refreshExpiry,
      {
        _id: admin._id,
        email: admin.email,
        username: admin.username,
        role: admin.role,
        mobile: admin.mobile,
      },
      config.accessSecret,
      config.accessExpiry
    );
    if (!(refreshToken && accessToken)) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Server is facing some issues in authenticating you~!`
          )
        );
    }
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });
    // recall the object with particular id to check for proper save
    const savedAdmin = await adminModel
      .findById(admin._id)
      .select("-password -refreshToken");
    if (!savedAdmin) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Auth controller :: Server is facing unknown issues while registeration! Please contact with development team~!`
          )
        );
    }
    // safelly send the response for congratulation and set cookie
    return res
      .cookie("accesstoken", accessToken)
      .cookie("refreshToken", refreshToken)
      .status(201)
      .json(
        new ApiResponse(
          201,
          `${fullname} as ${role} is registered successfully :)`,
          savedAdmin
        )
      );

    /* Done: response:-
      {
    "statusCode": 201,
    "message": "kuldeep kumar as admin is registered successfully :)",
    "data": {
        "_id": "6829****b86fae****fabf61",
        "fullname": "kuldeep kumar",
        "username": "mrkuldeep01",
        "email": "kuldeep@kuldeep.kuldeep",
        "gender": "M",
        "role": "admin",
        "mobile": 97******43,
        "avatar": "http://res.cloudinary.com/<********>/image/upload/v1747550271/un8zdtfgcvpm2u1vhmw7.jpg",
        "address": "vpo bahu akbarpur, rohtak, haryana",
        "worksBuddy": [],
        "createdAt": "2025-05-18T06:37:52.607Z",
        "updatedAt": "2025-05-18T06:37:52.780Z",
        "__v": 0
    },
    "success": true
    }*/
  }

  async function regFirm() {
    let {
      name,
      address,
      GSTNum,
      password,
      dealingIn,
      licenseType,
      licenseNum,
      email,
      mobile01,
      mobile02,
      UHBVNGSTNum,
      extraPremiumCharges,
      additionalFields,
    } = req.body;
    const dataArray = [
      name,
      address,
      GSTNum,
      password,
      dealingIn,
      licenseType,
      licenseNum,
      email,
      mobile01,
      UHBVNGSTNum,
      extraPremiumCharges,
    ];
    // validate data
    const isDataEmpty = Validator.testEmptyCheck(dataArray);
    if (isDataEmpty) {
      let { code, message } = isDataEmpty;
      return res
        .status(code)
        .json(
          new ApiError(
            code,
            `Please check all required fields!\nFor your reference fields are following:- [name, address, GST Number, password, dealing In, license Type, license Number, email, mobile01, UHBVN GST Number, extra Premium Charges]`
          )
        );
    }
    name = String(name.trim());
    address = String(address.trim());
    GSTNum = String(GSTNum.trim());
    password = String(password.trim());
    dealingIn = String(dealingIn.trim());
    licenseType = String(licenseType.trim());
    licenseNum = String(licenseNum.trim());
    email = String(email.trim());
    mobile01 = Number(mobile01.trim());
    mobile02 = mobile02 ? Number(mobile02.trim()) : undefined;
    UHBVNGSTNum = String(UHBVNGSTNum.trim());
    extraPremiumCharges = Number(extraPremiumCharges.trim());
    additionalFields = additionalFields || undefined;
    console.log(
      `New Firm visited to registere: ${name} with GST Number: (${GSTNum}) and UHBVN GST Number: ${UHBVNGSTNum} which is dealing in: ${dealingIn} from [address: ${address}] that have following email: ${email}`
    );
    // email & mobile no. type check
    const isEmailOrMobileWrong = helperObj.emailAndMobileTypeCheck(
      email,
      mobile01,
      mobile02
    );
    if (isEmailOrMobileWrong) {
      const { code, message } = isEmailOrMobileWrong;
      return res.status(code).json(new ApiError(code, message));
    }
    // existence check
    const isExistingFirm = await firmModel.findOne({
      $or: [{ GSTNum }, { email }, { mobile01 }, { UHBVNGSTNum }],
    });
    if (isExistingFirm) {
      return res
        .status(409)
        .json(
          new ApiError(
            409,
            `Given details like GST number, email id, mobile number, UHBVN GST number are in use, Please try to login if already registered! `
          )
        );
    }
    // handle image
    const avatar = await helperObj.avatarHandler(req);

    // create database object
    let firm = await firmModel.create({
      name,
      address,
      GSTNum,
      password,
      dealingIn,
      licenseType,
      licenseNum,
      email,
      mobile01,
      mobile02,
      UHBVNGSTNum,
      role,
      avatar,
      extraPremiumCharges,
      additionalFields,
    });
    if (!firm) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Server is facing an issue while registeration for ${name}`
          )
        );
    }

    console.log(`${firm?.name} saved successfully with ID: ${firm?._id}`);

    const { refreshToken, accessToken } = await helperObj.generateTokens(
      firm,
      { _id: firm?._id },
      config.refreshSecret,
      config.refreshExpiry,
      {
        _id: firm?._id,
        name: firm.name,
        GSTNum: firm.GSTNum,
        mobile01: firm.mobile01,
        UHBVNGSTNum: firm.UHBVNGSTNum,
        email: firm.email,
        role: firm.role,
      },
      config.accessSecret,
      config.accessExpiry
    );
    if (!(refreshToken && accessToken)) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            `Server is facing some issues in authenticating you! Please contact to developer team~!`
          )
        );
    }
    console.log(`Generated access and refresh tokens for firm: ${firm?.name}`);

    firm.refreshToken = refreshToken;
    await firm.save({ validateBeforeSave: false });
    // Is user save properly?
    const savedFirm = await firmModel
      .findById(firm._id)
      .select("-password -refreshToken");
    if (!savedFirm) {
      return res
        .status(500)
        .json(
          new ApiError(
            500,
            "Auth controller :: Server is unable to register firm due to unknown issues. Please contact to developer team!"
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
          `${name} as ${role} is registered successfully.`,
          savedFirm
        )
      );
  }
});
