import upload from "../config/upload.js";
import prisma from "../db/prisma.js"

export const createFolderGet = (req, res) => {
    res.render("create-folder");
}

export const createFolderPost = async (req, res) => {
    // Check if there's a parent directory
    const ownerId = req.user.id;
    const { name, parent_directory_id } = req.body;

    await prisma.folder.create({
        data: {
            ownerId: ownerId,
            name: name,
            parentDirectoryId: parent_directory_id ?? null
        }
    });

    res.redirect('/');
}

export const uploadFileGet = (req, res) => {
    res.render("upload-form");
}

export const uploadFilePost = [
    upload.single("file_upload"),
    async (req, res) => {
        const file = req.file;
        await prisma.file.create({
            data: {
                name: file.originalname,
                fileURL: file.path,
                ownerId: req.user.id
            }
        })    

        // TODO: Make this render the same page but with a message success
        res.redirect("/");
    }
]