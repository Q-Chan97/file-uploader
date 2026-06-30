import Router  from "express";
import passport from "passport";
import { getLogin, getSignUp, postSignUp } from "../controllers/authController.js";
import { validateUser, validateSignup } from "../utils/validation.js";

const authRouter = Router();

authRouter.get("/login", getLogin);
authRouter.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureMessage: true,
}));

authRouter.get("/sign-up", getSignUp);
authRouter.post("/sign-up", validateUser, validateSignup, postSignUp)

export default authRouter;