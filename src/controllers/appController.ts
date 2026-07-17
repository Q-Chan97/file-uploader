import { getUserFolders, createNewFile, getAllUserFiles, getFolderById, getFilesByFolderId, createNewFolder, deleteSingleFile, getFileById, changeFolderName, deleteFolderById } from "../db/queries.js";
import { type Request, type Response, type NextFunction } from "express";


export async function ensureAuthenticated (req: Request, res: Response, next: NextFunction) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

export async function getHome(req: Request, res: Response) {
    if (!req.user) return res.redirect("/login");

    const folders = await getUserFolders(req.user.id);
    const files = await getAllUserFiles(req.user.id);

    res.render("home", {user: req.user, folders: folders, files: files})
}

export async function uploadFile(req: Request, res: Response) {
    if (!req.file) {
        res.redirect(req.get("Referrer") ?? "/")
    }
    const folderId = req.body.folder;
    await createNewFile(req.file!, req.user!.id, folderId);

    if (folderId) {
        res.redirect(`/folder/${folderId}`)
    } else {
        res.redirect("/")
    }
}

export async function getFolderView(req: Request, res: Response) {

    const { folderId: folderIdParam } = req.params;

    if (!folderIdParam || Array.isArray(folderIdParam)) {
        return res.status(400).redirect("/")
    }
    
    const folderId = parseInt(folderIdParam);

    const folders = await getUserFolders(req.user!.id); // All folders for the sidebar

    const folder = await getFolderById(folderId); // Current folder for the view

    if (!folder) {
        res.status(404).render("404page")
    }

    const folderFiles = await getFilesByFolderId(folderId);

    res.render("folderView", {user: req.user, folders: folders, folder: folder, files: folderFiles})
}

export async function createFolder(req: Request, res: Response) {
    if (!req.user) return res.redirect("/login");

    const folderName = req.body.folderName;
    const folder = await createNewFolder(req.user.id, folderName);

    res.redirect(`/folder/${folder.id}`);
}

export async function deleteFile(req: Request, res: Response) {
    const { fileId: fileIdParams } = req.params;

    if (!fileIdParams || Array.isArray(fileIdParams)) { // Checks for either undefined or array in parameters
        return res.status(400).redirect("/")
    }

    const fileId = parseInt(fileIdParams);
    await deleteSingleFile(fileId);

    res.redirect(req.get("Referrer") ?? "/"); // Sends user back, or home if undefined
}

export async function downloadFile(req: Request, res: Response) {
    const { fileId: fileIdParams } = req.params;

    if (!fileIdParams || Array.isArray(fileIdParams)) {
        return res.status(400).redirect("/")
    }

    const fileId = parseInt(fileIdParams);
    const file = await getFileById(fileId);

    if (!file) {
        return res.status(400).redirect("/")
    }

    res.download(file.locationPath, file.fileName);
}

export async function deleteFolder(req: Request, res: Response) {
    const { folderId: folderIdParam } = req.params;

    if (!folderIdParam || Array.isArray(folderIdParam)) { 
        return res.status(400).redirect("/")
    }

    const folderId = parseInt(folderIdParam);

    await deleteFolderById(folderId);

    res.redirect("/");
}

export async function renameFolder(req: Request, res: Response) {
    const { folderId: folderIdParam } = req.params;

    if (!folderIdParam || Array.isArray(folderIdParam)) {
        return res.status(400).redirect("/")
    }

    const folderId = parseInt(folderIdParam);
    const newFolderName = req.body.newName;

    await changeFolderName(folderId, newFolderName);

    res.redirect(`/folder/${folderId}`)
}