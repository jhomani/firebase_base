import { Router } from "express";
import { getMethod, postMethod, patchMethod, singleGet, countMethod, deleteMethod } from "../controllers/tags.controller";

const router = Router();

router.route("/count").get(countMethod);
router.route("/").get(getMethod);
router.route("/:id").get(singleGet);
router.route("/").post(postMethod);
router.route("/:id").patch(patchMethod);
router.route("/:id").delete(deleteMethod);

export default router;