import { Router } from "express";
const router = Router();
import { home } from "../controllers/home.controller.js";
router.route('/').get(home);


export default router;