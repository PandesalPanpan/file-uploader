import { Router } from 'express'; 
import { isAuth } from '../middlewares/auth.js';
import * as fileController from '../controllers/FileController.js';

const fileRouter = Router()

// Everything here should require isAuth
fileRouter.use(isAuth);

fileRouter.get("/", (req, res) => {
    res.render("index");
})

fileRouter.get("/create-folder", fileController.createFolderGet); 
fileRouter.post("/create-folder", fileController.createFolderPost);


export default fileRouter;