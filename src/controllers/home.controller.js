import asyncHandler from "../utils/asyncHandler.js";
const home = asyncHandler(async function (req, res) {
  console.log("working at home route controller:)");
  console.log(
    `[${new Date().toISOString()}] 💥 Home route hit: ${req.method} ${req.url}`
  );
  console.log("request object is : \n");
  res.json({
    success: true,
    message: "we are ready to grind ~!",
  });
});

export { home };
