import Router from "express";
import { getHome, uploadFile, ensureAuthenticated, getFolderView, createFolder, deleteFile, downloadFile, renameFolder, deleteFolder } from "../controllers/appController.js";

import multer from "multer";
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }, // File sizes limited to 25mb
});

const appRouter = Router();

appRouter.post("/uploadFile", upload.single("newFile"), uploadFile);

appRouter.get("/folder/:folderId", ensureAuthenticated, getFolderView);

appRouter.post("/newFolder", createFolder);

appRouter.post("/folder/:folderId/edit", renameFolder);

appRouter.post("/folder/:folderId/delete", deleteFolder);

appRouter.post("/file/:fileId/delete", deleteFile);

appRouter.get("/file/:fileId/download", downloadFile);

appRouter.get("/", ensureAuthenticated, getHome);

export default appRouter;