import asyncHandler from "../utils/asyncHandler.js";
const home = asyncHandler(async function (req, res) {
  console.log("working at home route controller:)");
  return res.status(200).json({
    success: true,
    message: "we are ready to grind ~!",
    data: req
  });
});

export { home };
