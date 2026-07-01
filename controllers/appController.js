import { getUserFolders, createNewFile, getAllUserFiles, getFolderById, getFilesByFolderId } from "../db/queries.js";

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

    console.log("folderId from form: ", folderId);
    console.log("file", req.file)

    if (folderId) {
        res.redirect(`/folder/${folderId}`)
    } else {
        res.redirect("/")
    }
}

export async function getFolderView(req, res) {
    const folderId = parseInt(req.params.folderId);
    console.log("folderId:", folderId)

    const folders = await getUserFolders(req.user.id); // All folders for the sidebar
    console.log("folders", folders)

    const folder = await getFolderById(folderId); // Current folder for the view
    console.log("folder", folder)

    const folderFiles = await getFilesByFolderId(folderId);
    console.log("Folder files: ", folderFiles)

    res.render("folderView", {user: req.user, folders: folders, folder: folder, files: folderFiles})
}