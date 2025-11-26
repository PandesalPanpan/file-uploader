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


    res.render("index", { directoryId, folders, files });
}

export const createRootFolderGet = (req, res) => {
    res.render("create-folder");
}

export const createFolderInDirectoryGet = (req, res) => {
    const { directoryId } = req.params;

    res.render("create-folder", { directoryId: directoryId })
}

export const createFolderPost = async (req, res) => {
    // Check if there's a parent directory
    const ownerId = req.user.id;
    const { name, parent_directory_id } = req.body;

    const folder = await prisma.folder.create({
        data: {
            ownerId: ownerId,
            name: name,
            parentDirectoryId: Number(parent_directory_id) ?? null
        }
    });

    if (folder) {
        return res.redirect(`/folder/${folder.id}`);
    }

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

export const editFolderGet = async (req, res) => {
    const { folderId } = req.params;

    const folder = await prisma.folder.findFirst({
        where: {
            id: Number(folderId)
        }
    })

    res.render("edit-folder", { folder })
}

export const editFolderPost = async (req, res) => {
    const { folder_id, name} = req.body;

    const folder = await prisma.folder.update({
        where: {
            id: Number(folder_id)
        },
        data: {
            name: name
        }
    })

    res.render("edit-folder", { folder })
}