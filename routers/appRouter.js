import Router from "express";
import { getHome, uploadFile, ensureAuthenticated, getFolderView, createFolder, deleteFile, downloadFile } from "../controllers/appController.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const appRouter = Router();

appRouter.post("/uploadFile", upload.single("newFile"), uploadFile);

appRouter.get("/folder/:folderId", ensureAuthenticated, getFolderView);

appRouter.post("/newFolder", createFolder);

appRouter.post("/file/:fileId/delete", deleteFile);

appRouter.get("/file/:fileId/download", downloadFile);

appRouter.get("/", ensureAuthenticated, getHome);

export default appRouter;