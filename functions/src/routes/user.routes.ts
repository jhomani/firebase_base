import { Router } from "express";
import { getMethod, loginMethod, registerMethod } from "../controllers/user-controller";
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/").get(auth, getMethod);
router.route("/login").post(loginMethod);
router.route("/register").post(registerMethod);

export default router;

