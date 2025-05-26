const tester = async (req, res) => {
  try {
    console.log("hello web come boss!");
    res.json({
      success: true,
      message: "we are happy to see you",
      requestObject: req,
    });
  } catch (error) {
    console.log("error occured boss!");
    console.log(error);
    res.json({
      success: false,
      message: "server is facing issues",
      error: error ?? "error not available!",
    });
  }
};

export { tester };
