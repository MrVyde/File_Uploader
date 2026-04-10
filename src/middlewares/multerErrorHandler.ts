import multer from "multer";
import { Request, Response, NextFunction } from "express";

export const handleMulterErrors = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      req.flash("error", "File too large (max 5MB)");
      return res.redirect("back");
    }
  }

  if (err.message === "INVALID_FILE_TYPE") {
    req.flash("error", "Only JPG, PNG, PDF allowed");
    return res.redirect("back");
  }

  next(err);
};