import { Router } from "express";
import * as AuthController from '../controllers/AuthController.js'
const indexRouter = Router();

indexRouter.get("/sign-up", AuthController.signUpGet);
indexRouter.post("/sign-up", AuthController.signUpPost);

export default indexRouter;