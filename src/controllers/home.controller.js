import asyncHandler from "../Utils/AsyncHandler.js";
const home = asyncHandler(async function(req, res){
    console.log("working at home route controller:)");
    res.status(200).json({
        success: true,
        message: "we are ready to grind ~!"
    })
})

export {home}