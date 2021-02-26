import { Router } from "express";
import { getMethod, postMethod } from "../controllers/payment.controller";
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/").get(auth, getMethod);
router.route("/").post(auth, postMethod);

export default router;