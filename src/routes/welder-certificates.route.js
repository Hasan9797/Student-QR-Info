import { Router } from "express";
import welderCertificatesController from "../controllers/welder-certificates.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authentication, welderCertificatesController.getAll);
router.get("/:id", authentication, welderCertificatesController.getById);
router.post("/create", authentication, welderCertificatesController.create);
router.put("/update/:id", authentication, welderCertificatesController.update);
router.delete("/delete/:id", authentication, welderCertificatesController.remove);

export default router;
