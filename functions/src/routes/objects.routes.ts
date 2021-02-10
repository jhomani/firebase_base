import { Router } from "express";
import {
  getMethod, postMethod, patchMethod, getMyMethod,
  singleGet, countMethod, deleteMethod, deleteFilesMethod
} from "../controllers/object.controller";
import { getMyFavorites } from "../controllers/user-controller"
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/count").get(auth, countMethod);
router.route("/favorites").get(auth, getMyFavorites);
router.route("/").get(auth, getMethod);
router.route("/me").get(auth, getMyMethod);
router.route("/:id").get(auth, singleGet);
router.route("/").post(auth, postMethod);
router.route("/:id").patch(auth, patchMethod);
router.route("/:id/files").delete(auth, deleteFilesMethod);
router.route("/:id").delete(auth, deleteMethod);

export default router;