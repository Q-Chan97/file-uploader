import Router from "express";
import { getHome } from "../controllers/appController.js";

const appRouter = Router();

appRouter.get("/home", getHome);

export default appRouter;