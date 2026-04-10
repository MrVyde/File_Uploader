import express from "express";
import type { Request, Response, NextFunction } from "express";
import passport from '../config/passport';
import * as authService from '../services/usersService';
import type { User } from "@prisma/client";
import { validationResult } from "express-validator";

// Register
export const getSignup = (req: Request, res: Response) => {
  res.render("users/signup", { 
    old: {}, 
    errors: [] 
  });
};

export const postSignup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render('users/signup', {
      errors: errors.array(), // send all validation errors
      old: req.body // preserve old input
    });
  }

  try {
    const user = await authService.createUser(email, password, firstName, lastName);
    return res.redirect('/api/users/login');
  } catch (err: any) {
    return res.status(400).render('users/signup', {
      errors: [{ msg: err.message }], // wrap duplicate email error
      old: req.body
    });
  }
};

// Login
export const getLogin = (req: Request, res: Response) => {
  res.render("users/login", {
    errors: [],   // prevent undefined
    old: {}       // for input persistence
  });
};

export const postLogin = (req: Request, res: Response, next: any) => {
  const { email } = req.body;

  // validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("users/login", {
      errors: errors.array(),
      old: { email }
    });
  }

  passport.authenticate("local", (err: Error | null, user: User | false, info: any) => {
    if (err) return next(err);

    if (!user) {
      return res.status(400).render("users/login", {
        errors: [{ msg: info?.message || "Invalid credentials" }],
        old: { email }
      });
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
};

// Logout
export const postlogout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.redirect("/?logout=success");
      });
    } else {
      return res.redirect("/");
    }
  });
};

// Get Current User
export const getMe = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const user = await authService.findUserById((req.user as any).id);
  res.json(user);
};

// Update Profile
export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  const {firstName, lastName, password } = req.body;
  try {
    const updatedUser = await authService.updateUser((req.user as any).id, { firstName, lastName, password });
    res.json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: 'Could not update profile' });
  }
};

// Delete Account
export const deleteAccount = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  try {
    await authService.deleteUser((req.user as any).id);
    req.logout(() => {});
    res.json({ message: 'Account deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Could not delete account' });
  }
};