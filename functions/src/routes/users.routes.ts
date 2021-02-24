import { auth } from '../midlewares/authMiddle';
import { Router } from "express";

import {
  getMethod, loginMethod, loginSocialMedia,
  registerMethod, singleGet, verifyEmail,
  logoutMethod, deleteMethod, getMeUser,
  patchMethod, countMethod, deleteFileMethod,
  newPassowrd, resetPassowrd, verifyResetCode
} from "../controllers/user-controller";

const router = Router();

router.route("/").get(auth, getMethod);
router.route("/count").get(auth, countMethod);
router.route("/login").post(loginMethod);
router.route("/reset-password").post(resetPassowrd);
router.route("/verify-code").post(verifyResetCode);
router.route("/new-password").post(newPassowrd);
router.route("/verify-email/:token").get(verifyEmail);
router.route("/register").post(registerMethod);
router.route("/social-media").post(loginSocialMedia);
router.route("/logout").post(auth, logoutMethod);
router.route("/:id").delete(auth, deleteMethod);
router.route("/:id/file").delete(auth, deleteFileMethod);
router.route("/me").get(auth, getMeUser);
router.route("/:id").patch(auth, patchMethod);
router.route("/:id").get(auth, singleGet);

export default router;