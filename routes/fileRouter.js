import { Router } from 'express'; 
import { isAuth } from '../middlewares/auth.js';

const fileRouter = Router()

// Everything here should require isAuth
fileRouter.use(isAuth);

fileRouter.get("/", (req, res) => {
    res.render("index");
})

export default fileRouter;