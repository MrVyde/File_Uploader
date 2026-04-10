import { Router } from "express";
import * as authController from "../controllers/usersController";
import { ensureAuthenticated } from "../middlewares/authMiddleware";
import { validateSignup, validateLogin } from "../middlewares/authValidator";

const router = Router();


// Public routes
router.get("/new", authController.getSignup);
router.get("/login", authController.getLogin);
router.post("/submit", validateSignup, authController.postSignup);
router.post("/login", validateLogin, authController.postLogin);
router.post("/logout", authController.postlogout); // can be protected if you want

// Protected routes (require authentication)
router.get("/me", ensureAuthenticated, authController.getMe);
router.put("/me", ensureAuthenticated, authController.updateProfile);
router.delete("/me", ensureAuthenticated, authController.deleteAccount);

export default router;