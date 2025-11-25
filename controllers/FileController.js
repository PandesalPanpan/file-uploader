import upload from "../config/upload.js";
import prisma from "../db/prisma.js"

export const getRootContents = async (req, res) => {
    const [folders, files] = await prisma.$transaction([
        prisma.folder.findMany({
            where: { parentDirectoryId: null, ownerId: req.user.id }
        }),
        prisma.file.findMany({
            where: { directoryId: null, ownerId: req.user.id }
        })
    ])


    res.render("index", { files, folders })
}

export const getDirectoryContents = async (req, res) => {
    const ownerId = req.user.id;
    const { directoryId } = req.params;

    const dirId = isNaN(directoryId) ? null : Number(directoryId);
    if (directoryId != null && Number.isNaN(dirId)) {
        return res.status(400).send('Invalid directory id');
    }

    const [folders, files] = await prisma.$transaction([
        prisma.folder.findMany({
            where: { parentDirectoryId: dirId, ownerId: ownerId }
        }),
        prisma.file.findMany({
            where: { directoryId: dirId, ownerId: ownerId }
        })
    ]);


    res.render("index", { folders, files });
}

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