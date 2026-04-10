import { body } from "express-validator";

export const validateFolder = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Folder name is required")
    .isLength({ max: 20 })
    .withMessage("Folder name must be less than 20 characters")
    .escape()
];