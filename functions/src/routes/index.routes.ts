import { Router } from "express";
const router = Router();

import { deleteIndex, getIndex, getOneIndex, patchIndex, postIndex } from "../controllers/index.controller";

router.route("/").get(getIndex);
router.route("/").post(postIndex);
router.route("/:id").get(getOneIndex);
router.route("/:id").delete(deleteIndex);
router.route("/:id").patch(patchIndex);

export default router;
