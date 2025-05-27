import asyncHandler from "../utils/asyncHandler.js";
const home = asyncHandler(async function (req, res) {
  console.log("working at home route controller:)");
  console.log(
    `[${new Date().toISOString()}] 💥 Home route hit with method[${
      req.method
    }] through requested url : [${req.url}]`
  );
  res.json({
    success: true,
    message: "we are ready to grind ~!",
  });
});

export { home };
