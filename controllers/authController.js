import bcrypt from "bcryptjs";
import { createUser, createDefaultFolder } from "../db/queries.js";

export async function getLogin (req, res) {
    res.render("login")
}

export async function getSignUp (req, res) {
    res.render("sign-up")
}

export async function postSignUp (req, res, next) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await createUser(req.body.username, hashedPassword, req.body.email);
        await createDefaultFolder(newUser.id);

        res.redirect("/login")
    } catch (err) {
        next(err);
    }
}

export async function forwardAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}