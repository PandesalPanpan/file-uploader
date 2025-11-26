import multer from "multer";

export const MAX_FILE_SIZE = 1024 * 1024

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: MAX_FILE_SIZE } });

export default upload;