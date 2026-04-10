import { body } from "express-validator";

export const validateSignup = [
  body("firstName")
    .trim()
    .isLength({ min: 1 }).withMessage("First name is required")
    .escape(),

  body("lastName")
    .trim()
    .isLength({ min: 1 }).withMessage("Last name is required")
    .escape(),

  body("email")
    .trim()
    .isEmail().withMessage("Enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    })
];

export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

