import Router  from "express";
import { getLogin, getSignUp, postSignUp } from "../controllers/authController.js";
import { validateUser, validateSignup } from "../utils/validation.js";

const authRouter = Router();

authRouter.get("/login", getLogin);

authRouter.get("/sign-up", getSignUp);
authRouter.post("/sign-up", validateUser, validateSignup, postSignUp)

export default authRouter;