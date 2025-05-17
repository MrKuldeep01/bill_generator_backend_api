import Router from "express"
import { Register } from "../controllers/auth.controller.js";
import { upload } from "../middelwares/multer.middelware.js";
const router = Router();

router.route('/register').post(upload.single('avatar'),Register)

export default router;