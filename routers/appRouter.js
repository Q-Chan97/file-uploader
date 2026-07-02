import Router from "express";
import { getHome, uploadFile, ensureAuthenticated, getFolderView, createFolder } from "../controllers/appController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const appRouter = Router();

appRouter.post("/uploadFile", upload.single("newFile"), uploadFile);

appRouter.get("/folder/:folderId", ensureAuthenticated, getFolderView);

appRouter.post("/newFolder", createFolder);

appRouter.get("/", ensureAuthenticated, getHome);

export default appRouter;