import { Request, Response } from "express";
import * as folderService from "../services/foldersService";
import type { FolderWithFiles } from "../services/foldersService";

export const getHome = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      return res.render("index", { folders: [], errors: [], oldInput: {}, activeFolder: null, currentUser: null, errorMessages: [], successMessages: [] });
    }

    const userId = (req.user as { id: number }).id;
    const folders: FolderWithFiles[] = await folderService.getFoldersByUser(userId);

    const activeFolderId = req.query.folderId as string;

    let activeFolder = null;

    if (activeFolderId) {
      activeFolder = folders.find(f => f.id === activeFolderId) || null;
    } 

    if (!activeFolder && folders.length > 0) {
      activeFolder = folders[0];
    }

    const activeFileId = req.query.fileId as string;

    let activeFile = null;

    if (activeFolder && activeFileId) {
    activeFile = activeFolder.files.find(f => f.id === activeFileId) || null;
    }


    res.render("index", { folders, activeFolder, activeFile, currentUser: req.user, errors: [], successMessages: [], oldInput: {}  });
  } catch (err) {
    console.error(err);
    res.render("index", { folders: [], activeFolder: null, errorMessages: ["Something went wrong"], successMessages: []
  });
  }
};