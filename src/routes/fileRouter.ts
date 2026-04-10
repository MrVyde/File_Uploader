import { Router } from "express";
import * as fileController from "../controllers/fileController";
import { upload } from "../middlewares/uploadMiddleware";
import { ensureAuthenticated } from "../middlewares/authMiddleware";
import { validateFileRename } from "../middlewares/fileValidator";

const router = Router();

// upload file to a folder
router.post("/upload", ensureAuthenticated, upload.single("file"), fileController.uploadFile);

router.get("/:id", ensureAuthenticated, fileController.getFileDetails);

router.post("/:id/rename", ensureAuthenticated, validateFileRename, fileController.renameFile);

// download a file
router.get("/:id/download", ensureAuthenticated, fileController.downloadFile);

// get files in a folder
router.get("/folder/:folderId", ensureAuthenticated, fileController.getFolderFiles);

// delete file
router.delete("/:id", ensureAuthenticated, fileController.deleteFile);

export default router;