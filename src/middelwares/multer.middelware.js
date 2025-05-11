import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now();
      cb(null, file.originalname + '_' + uniqueName)
    }
  })
  
  export const upload = multer({ storage })