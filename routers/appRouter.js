import Router from "express";
import { getHome } from "../controllers/appController.js";
import { ensureAuthenticated } from "../controllers/appController.js";

const appRouter = Router();

appRouter.get("/", ensureAuthenticated, getHome);

export default appRouter;