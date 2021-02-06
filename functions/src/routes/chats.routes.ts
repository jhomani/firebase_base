import { Router } from "express";
import {
  getMethod, postMethod, patchMethod,
  singleGet, countMethod, deleteMethod,
  getMethodOwn
} from "../controllers/chats.controller";
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/count/me").get(auth, countMethod);
router.route("/me").get(auth, getMethodOwn);
router.route("/").get(auth, getMethod);
router.route("/:id").get(auth, singleGet);
router.route("/").post(auth, postMethod);
router.route("/:id").patch(auth, patchMethod);
router.route("/:id").delete(auth, deleteMethod);

export default router;