import Router  from "express";
import passport from "passport";
import { getLogin, getSignUp, postSignUp, forwardAuthenticated } from "../controllers/authController.js";
import { validateUser, validateSignup } from "../utils/validation.js";

const authRouter = Router();

authRouter.get("/login", forwardAuthenticated, getLogin);
authRouter.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureMessage: true,
}));

authRouter.get("/sign-up", forwardAuthenticated, getSignUp);
authRouter.post("/sign-up", validateUser, validateSignup, postSignUp)

authRouter.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        res.redirect("/login");
    });
});

export default authRouter;