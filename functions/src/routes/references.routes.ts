import { Router } from "express";
import { getMethod, postMethod, patchMethod, singleGet, countMethod, deleteMethod } from "../controllers/references.controller";
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/count").get(auth, countMethod);
router.route("/").get(auth, getMethod);
router.route("/:id").get(auth, singleGet);
router.route("/").post(auth, postMethod);
router.route("/:id").patch(auth, patchMethod);
// router.route("/:id/images").delete(auth, deleteMethod);
router.route("/:id").delete(auth, deleteMethod);

export default router;