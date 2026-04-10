import { Request, Response } from "express";
import * as shareService from "../services/shareService";
import * as folderService from "../services/foldersService";
import fs from "fs";
import path from "path";

/** Create share link (protected route) */
export const createShare = async (req: Request, res: Response) => {
  try {
    const { folderId, duration } = req.body;
    const user = req.user as any;
    const parsedDuration = Number(duration);

    // Validate inputs
    if (!folderId || typeof folderId !== "string") {
      return res.status(400).json({ message: "Invalid folder id" });
    }
    if (!parsedDuration || isNaN(parsedDuration)) {
      return res.status(400).json({ message: "Invalid duration format" });
    }

    // Ownership check
    const folder = await folderService.getFolderById(folderId);
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    if (folder.ownerId !== user.id) return res.status(403).json({ message: "Unauthorized" });

    // Create share
    const share = await shareService.createShare(folderId, parsedDuration);

    res.json({ token: share.token });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

/** View shared folder (public route) */
export const getSharedFolder = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    if (!token || Array.isArray(token)) {
      return res.status(400).send("Invalid link");
    }

    // Service handles expiry internally
    const folder = await shareService.getSharedFolderByToken(token);
    if (!folder) {
      return res.status(403).send("This link has expired or is invalid");
    }

    // Render read-only view
    res.render("share/show", {
      folder,
      files: folder.files,
      token,
      currentUser: null,       // force read-only mode
      errorMessages: [],
      successMessages: [],
    });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};


/** View a single shared file (public route) */
// View shared file
export const viewSharedFile = async (req: Request, res: Response) => {
  const { token, fileId } = req.params;

  if (!token || !fileId || Array.isArray(token) || Array.isArray(fileId)) {
    return res.status(400).send("Invalid parameters");
  }

  const result = await shareService.getSharedFile(token, fileId);
  if (!result) return res.status(404).send("File not found or link expired");

  const { file } = result;

  res.sendFile(file.absolutePath);
};

export const downloadSharedFile = async (req: Request, res: Response) => {
  const { token, fileId } = req.params;

  if (!token || !fileId || Array.isArray(token) || Array.isArray(fileId)) {
    return res.status(400).send("Invalid parameters");
  }

  const result = await shareService.getSharedFile(token, fileId);
  if (!result) return res.status(404).send("File not found");

  const { file } = result;

  res.download(file.absolutePath, file.filename);
};

