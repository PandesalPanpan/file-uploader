import { Router } from "express";
import * as AuthController from '../controllers/AuthController.js'
const authRouter = Router();

authRouter.get("/sign-up", AuthController.signUpGet);
authRouter.post("/sign-up", AuthController.signUpPost);
authRouter.get("/login", AuthController.loginGet);
authRouter.post("/login", AuthController.loginPost);
authRouter.get("/logout", AuthController.logout);

export default authRouter;