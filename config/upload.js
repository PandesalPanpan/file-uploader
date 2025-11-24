import multer from "multer";
import path from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDirectory = path.join(__dirname, "../public/data");

const upload = multer({ dest: uploadDirectory });

export default upload;