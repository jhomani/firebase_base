import { Router } from "express";
const router = Router();

import { getIndex } from "../controllers/index.controller";

router.route("/").get(getIndex);

export default router;
