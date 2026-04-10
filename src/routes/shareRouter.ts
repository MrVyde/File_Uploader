import { Router } from "express";
import * as shareController from "../controllers/shareController";
import { ensureAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

// POST /share/create-
router.post("/create", ensureAuthenticated, shareController.createShare);

// GET /share/:token - anyone with the token can view the shared folder
router.get("/:token", shareController.getSharedFolder);

// Public routes (no auth)
router.get("/:token/file/:fileId", shareController.viewSharedFile);
router.get("/:token/download/:fileId", shareController.downloadSharedFile);

export default router;