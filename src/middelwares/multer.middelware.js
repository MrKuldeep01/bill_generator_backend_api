import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("public/temp"));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now();
    let firstName = file.originalname.substring(0,String(file.originalname).lastIndexOf('.'));
    let lastName = file.originalname.substring(String(file.originalname).lastIndexOf('.'));
    cb(null, `${firstName}_${uniqueName}${lastName}`);
  },
});

export const upload = multer({ storage });
