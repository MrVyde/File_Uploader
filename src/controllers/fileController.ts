import { Request, Response } from "express";
import * as fileService from "../services/fileService";
import * as folderService from "../services/foldersService";
import { validationResult } from "express-validator";
import fs from "fs";
import * as path from "path";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    const { folderId } = req.body;

    if (!file) {
      req.flash("error", "No file uploaded");
      return res.redirect("back"); // go back to previous page
    }

    if (!folderId) {
      req.flash("error", "Folder ID is required");
      return res.redirect("back");
    }

    const user = req.user as any;

    await fileService.createFile({
      filename: file.originalname,
      url: file.path,
      size: file.size,
      folderId,
      ownerId: user.id,
    });

    req.flash("success", "File uploaded successfully");
    res.redirect(`/?folderId=${folderId}`); // redirect to the folder view
  } catch (error: any) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

export const getFileDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as any;

    if (typeof id !== "string") {
      return res.redirect("/");
    }

    const file = await fileService.getFileById(id);

    if (!file || file.ownerId !== user.id) {
      return res.status(404).send("File not found");
    }

    res.render("file/details", {
      file,
      errors: [],
      oldInput: {} 
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const renameFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId; // narrow type
    const user = req.user as any;

    if (!id) {
      res.status(400).send("Invalid file ID");
      return;
    }

    const file = await fileService.getFileById(id);

    if (!file || file.ownerId !== user.id) {
      res.status(403).send("Unauthorized");
      return;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const folders = await folderService.getFoldersByUser(user.id);
      const folder = await folderService.getFolderById(file.folderId);

      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: errors.array(),
        oldInput: req.body,
        activeFolder: folder,   
        activeFile: file
      });
    }

    const filename = req.body.filename;
    await fileService.updateFileName(id, filename);

    res.redirect(`/files/${id}`);
  } catch (error: any) {
    console.error(error);

    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const user = req.user as any;

    const folders = await folderService.getFoldersByUser(user.id);
    const file = id ? await fileService.getFileById(id) : null;
    const folder = file ? await folderService.getFolderById(file.folderId) : null;

    if (error.code === "P2002") {
      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: [{ msg: "File with this name already exists in this folder" }],
        oldInput: req.body,
        activeFolder: folder,
        activeFile: file
      });
    }

    res.render("index", {
      folders,
      currentUser: req.user,
      errors: [{ msg: "Failed to rename file" }],
      oldInput: req.body,
      activeFolder: folder,
      activeFile: file
    });
  }
};



export const getFolderFiles = async (req: Request, res: Response) => {
  try {
    const { folderId } = req.params;
    const user = req.user as any;

    if (!folderId || typeof folderId !== "string") {
      return res.status(400).json({ message: "Invalid folderId" });
    }

    const files = await fileService.getFilesByFolder(
      folderId,
      user.id
    );

    res.json(files);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as any;

    if (!id || typeof id !== "string") {
      req.flash("error", "Invalid file id");
      return res.redirect("back");
    }

    const file = await fileService.getFileById(id);

    if (!file) {
      req.flash("error", "File not found");
      return res.redirect("back");
    }

    if (file.ownerId !== user.id) {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }

    const filePath = path.resolve(file.url);

    if (!fs.existsSync(filePath)) {
      req.flash("error", "File not found on server");
      return res.redirect("back");
    }

    res.download(filePath, file.filename);
  } catch (error: any) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = req.user as any;

    if (!id || typeof id !== "string") {
      req.flash("error", "Invalid file id");
      return res.redirect("back");
    }

    const file = await fileService.getFileById(id);

    if (!file) {
      req.flash("error", "File not found");
      return res.redirect("back");
    }

    // ownership check
    if (file.ownerId !== user.id) {
      req.flash("error", "Unauthorized");
      return res.redirect("back");
    }

    // delete file from disk
    if (fs.existsSync(file.url)) {
      fs.unlinkSync(file.url);
    }

    await fileService.deleteFile(id);

    req.flash("success", "File deleted successfully");
    //redirect back to folder
    res.redirect(`/?folderId=${file.folderId}`);

  } catch (error: any) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};