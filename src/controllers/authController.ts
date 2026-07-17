import bcrypt from "bcryptjs";
import { createUser, createDefaultFolder } from "../db/queries.js";
import { type Request, type Response, type NextFunction } from "express";

export async function getLogin (req: Request, res: Response) {
    const messages = req.session.messages;
    req.session.messages = [];
    res.render("login", {errors: messages})
}

export async function getSignUp (_req: Request, res: Response) {
    res.render("sign-up", {errors: []})
}

export async function postSignUp (req: Request, res: Response, next: NextFunction) {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)

        const newUser = await createUser(req.body.username, hashedPassword, req.body.email);
        await createDefaultFolder(newUser.id);

        res.redirect("/login")
    } catch (err) {
        next(err);
    }
}

export async function forwardAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect("/")
}