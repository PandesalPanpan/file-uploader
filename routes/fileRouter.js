import { Router } from 'express'; 
import { isAuth } from '../middlewares/auth.js';
import * as fileController from '../controllers/FileController.js';

const fileRouter = Router()

// Everything here should require isAuth
fileRouter.use(isAuth);

fileRouter.get("/", fileController.getRootContents);
fileRouter.get("/folder/:directoryId", fileController.getDirectoryContents);

fileRouter.get("/create-folder/:directoryId", fileController.createFolderInDirectoryGet);
fileRouter.get("/create-folder", fileController.createRootFolderGet); 
fileRouter.post("/create-folder", fileController.createFolderPost);

fileRouter.get("/edit-folder/:folderId", fileController.editFolderGet);
fileRouter.post("/edit-folder", fileController.editFolderPost);
fileRouter.get("/folder/:folderId/delete", fileController.deleteFolder);

fileRouter.get("/upload-files", fileController.uploadFileGet);
fileRouter.post("/upload-files", fileController.uploadFilePost);
fileRouter.get("/upload-files/:folderId", fileController.uploadFileInDirectoryGet);

export default fileRouter;