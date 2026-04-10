import { Router } from "express";
import * as folderController from "../controllers/foldersController";
import { ensureAuthenticated } from "../middlewares/authMiddleware"; // you can create this
import {validateFolder } from "../middlewares/folderValidator";

const router = Router();

// GET all folders (dashboard/sidebar)
router.get("/", ensureAuthenticated, folderController.getFolders);

// GET single folder (details + files)
router.get("/:id", ensureAuthenticated, folderController.getFolderById);

// CREATE a new folder
router.post("/create", ensureAuthenticated, validateFolder, folderController.createFolder);

// UPDATE folder name
router.post("/:id/update", ensureAuthenticated, validateFolder, folderController.updateFolder);

// DELETE folder
router.post("/:id/delete", ensureAuthenticated, folderController.deleteFolder);

export default router;