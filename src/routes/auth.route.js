import { Router } from "express";

import authController from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.get("/me", authentication, authController.getMe);

export default router;
