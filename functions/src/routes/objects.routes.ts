import { Router } from "express";
import {
  getMethod, postMethod, patchMethod, getMyMethod,
  singleGet, countMethod, deleteMethod, deleteFilesMethod,
  publishInFacebookAds
} from "../controllers/object.controller";
import { getMyFavorites } from "../controllers/user-controller"
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/count").get(countMethod);
router.route("/favorites").get(auth, getMyFavorites);
router.route("/publish-ads").post(auth, publishInFacebookAds);
router.route("/").get(getMethod);
router.route("/me").get(auth, getMyMethod);
router.route("/:id").get(singleGet);
router.route("/").post(auth, postMethod);
router.route("/:id").patch(auth, patchMethod);
router.route("/:id/files").delete(auth, deleteFilesMethod);
router.route("/:id").delete(auth, deleteMethod);

export default router;
