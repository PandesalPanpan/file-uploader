import { Router } from "express";
import * as AuthController from '../controllers/AuthController.js'
const indexRouter = Router();

indexRouter.get("/sign-up", AuthController.signUpGet);
indexRouter.post("/sign-up", AuthController.signUpPost);
indexRouter.get("/login", AuthController.loginGet);
indexRouter.post("/login", AuthController.loginPost);
indexRouter.get("/logout", AuthController.logout);
indexRouter.get('/', (req, res) => {
    res.render("index");
})

export default indexRouter;