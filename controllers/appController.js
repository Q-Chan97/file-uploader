import { getUserFolders, createNewFile, getAllUserFiles, getFolderById, getFilesByFolderId, createNewFolder, deleteSingleFile, getFileById } from "../db/queries.js";

export async function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

export async function getHome(req, res) {
    const folders = await getUserFolders(req.user.id);
    const files = await getAllUserFiles(req.user.id);

    res.render("home", {user: req.user, folders: folders, files: files})
}

export async function uploadFile(req, res) {
    const folderId = req.body.folder;
    await createNewFile(req.file, req.user.id, folderId);

    if (folderId) {
        res.redirect(`/folder/${folderId}`)
    } else {
        res.redirect("/")
    }
}

export async function getFolderView(req, res) {
    const folderId = parseInt(req.params.folderId);

    const folders = await getUserFolders(req.user.id); // All folders for the sidebar

    const folder = await getFolderById(folderId); // Current folder for the view

    const folderFiles = await getFilesByFolderId(folderId);

    res.render("folderView", {user: req.user, folders: folders, folder: folder, files: folderFiles})
}

export async function createFolder(req, res) {
    const folderName = req.body.folderName;
    const folder = await createNewFolder(req.user.id, folderName);

    res.redirect(`/folder/${folder.id}`);
}

export async function deleteFile(req, res) {
    const fileId = parseInt(req.params.fileId);
    await deleteSingleFile(fileId);

    res.redirect(req.get("Referrer")); // Sends user back
}

export async function downloadFile(req, res) {
    const fileId = parseInt(req.params.fileId);
    const file = await getFileById(fileId);

    res.download(file.locationPath, file.fileName);
}