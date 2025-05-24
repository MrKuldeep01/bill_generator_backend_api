import { Router } from "express";
const router = Router();
import { home as Home} from "../controllers/home.controller.js";
router.route('/').get(Home);


export default router;