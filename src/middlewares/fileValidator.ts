import { body } from "express-validator";

export const validateFileRename = [
  body("filename")
    .trim()
    .notEmpty()
    .withMessage("Filename is required")
    .isLength({ max: 20 })
    .withMessage("Filename must be less than 20 characters")
    .escape()
];