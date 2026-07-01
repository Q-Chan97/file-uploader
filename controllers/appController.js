import { getUserFolders } from "../db/queries.js";

export async function ensureAuthenticated (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}

export async function getHome(req, res) {
    const folders = await getUserFolders(req.user.id);

    res.render("home", {user: req.user, folders: folders})
}