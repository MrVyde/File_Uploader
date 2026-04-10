import express from "express";
import type { Request, Response, NextFunction } from "express";
import {Folder } from "@prisma/client";
import * as folderService from "../services/foldersService";
import { validationResult } from "express-validator";



export const createFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    const userId = (req.user as { id: number }).id;

    const folders = await folderService.getFoldersByUser(userId);

    if (!errors.isEmpty()) {
      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: errors.array(),
        oldInput: req.body,
        activeFolder: null,
        activeFile: null
      });
    }

    const { name } = req.body;

    await folderService.createFolder(name, userId);

    // PRG on success
    res.redirect("/");

  } catch (err: any) {
  const userId = (req.user as { id: number }).id;
  const folders = await folderService.getFoldersByUser(userId);

  if (err.code === "P2002") {
    return res.render("index", {
      folders,
      currentUser: req.user,
      errors: [{ msg: "Folder with this name already exists" }],
      oldInput: req.body,
      activeFolder: null,
      activeFile: null
    });
  }

  console.error(err);
  res.render("index", {
    folders,
    currentUser: req.user,
    errors: [{ msg: "Failed to create folder" }],
    oldInput: req.body,
    activeFolder: null,
    activeFile: null
  });
}
};


export const getFolders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as { id: number }).id;
    const folders = await folderService.getFoldersByUser(userId);

    // Pass errors and oldInput, even if empty
    res.render("index", { 
      folders, 
      currentUser: req.user,
      errors: [],          // empty array if no validation errors
      oldInput: {},        // empty object if no old input
      activeFolder: null,  // prevent EJS crashes
      activeFile: null
    });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Failed to fetch folders" });
  }
};



export const getFolderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const folderId = req.params.id;
    
    if (!folderId || Array.isArray(folderId)) {
      req.flash("error", "Invalid folder ID");
      return res.redirect("/folders");
    }

    const folder = await folderService.getFolderById(folderId);

    if (!folder) {
      return res.render("error", { message: "Folder not found" });
    }

    res.render("folders/show", { folder });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Failed to fetch folder" });
  }
};



export const updateFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    const userId = (req.user as { id: number }).id;
    const folderId = req.params.id;

    const folders = await folderService.getFoldersByUser(userId);

    if (!folderId || Array.isArray(folderId)) {
      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: [{ msg: "Invalid folder ID" }],
        oldInput: {},
        activeFolder: null,
        activeFile: null
      });
    }

    if (!errors.isEmpty()) {
      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: errors.array(),
        oldInput: req.body,
        activeFolder: null,
        activeFile: null,
      });
    }

    const name = req.body.name.trim();

    await folderService.updateFolder(folderId, name);

    // PRG on success
    res.redirect("/");

  } catch (err: any) {
    const userId = (req.user as { id: number }).id;
    const folders = await folderService.getFoldersByUser(userId);

    // Handle duplicate (Prisma)
    if (err.code === "P2002") {
      return res.render("index", {
        folders,
        currentUser: req.user,
        errors: [{ msg: "Folder with this name already exists" }],
        oldInput: req.body,
        activeFolder: null,
        activeFile: null
      });
    }

    console.error(err);
    res.render("index", {
      folders,
      currentUser: req.user,
      errors: [{ msg: "Failed to update folder" }],
      oldInput: req.body,
      activeFolder: null,
      activeFile: null
    });
  }
};



export const deleteFolder = async (req: Request, res: Response): Promise<void> => {
  try {
    const folderId = req.params.id;

    if (!folderId || Array.isArray(folderId)) {
      req.flash("error", "Invalid folder ID");
      return res.redirect("/");
    }


    await folderService.deleteFolder(folderId);

    res.redirect("/");
  } catch (err: any) {
    console.error(err);
    if (err.code === "P2003") {
      req.flash("error", "Cannot delete folder with files");
      return res.redirect("/");
    }

    req.flash("error", "Failed to delete folder");
    res.redirect("/");
  }
};