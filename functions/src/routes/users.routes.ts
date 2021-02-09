import { auth } from '../midlewares/authMiddle';
import { Router } from "express";

import {
  getMethod, loginMethod, loginSocialMedia,
  registerMethod, singleGet,
  logoutMethod, deleteMethod, getMeUser,
  patchMethod, countMethod, deleteFileMethod
} from "../controllers/user-controller";

const router = Router();

router.route("/").get(auth, getMethod);
router.route("/count").get(auth, countMethod);
router.route("/login").post(loginMethod);
router.route("/register").post(registerMethod);
router.route("/social-media").post(loginSocialMedia);
router.route("/logout").post(auth, logoutMethod);
router.route("/:id").delete(auth, deleteMethod);
router.route("/:id/file").delete(auth, deleteFileMethod);
router.route("/me").get(auth, getMeUser);
router.route("/:id").patch(auth, patchMethod);
router.route("/:id").get(auth, singleGet);

export default router;

