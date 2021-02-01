import { Router } from "express";
import { getMethod, postMethod, singleGet, countMethod, deleteMethod } from "../controllers/upload-file.controller ";
import { auth } from '../midlewares/authMiddle';

const router = Router();

router.route("/count").get(countMethod);
router.route("/").get(getMethod);
router.route("/:id").get(singleGet);
router.route("/").post(postMethod);
router.route("/:id").delete(deleteMethod);

export default router;