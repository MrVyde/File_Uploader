// app.ts
import express from "express";
import path from "node:path";
import flash from "connect-flash";

import usersRoute from "./routes/userRouter";
import foldersRoute from "./routes/folderRouter";
import fileRoute from "./routes/fileRouter";
import shareRouter from "./routes/shareRouter";

import { sessionMiddleware } from "./config/session";
import passport from "./config/passport";
import { getHome } from "./controllers/homeController";
import { handleMulterErrors } from "./middlewares/multerErrorHandler";

import methodOverride from "method-override";

const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(methodOverride("_method"));

// Views
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session + Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

//handles multer errors
app.use(handleMulterErrors);

// Middleware for flash messages and current user
app.use((req, res, next) => {
  res.locals.successMessages = req.flash("success");
  res.locals.errorMessages = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Route
app.get("/", getHome);

app.use("/api/users", usersRoute);

app.use("/folders", foldersRoute);

app.use("/files", fileRoute);

app.use("/share", shareRouter);

export default app;