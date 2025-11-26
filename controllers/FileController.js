import { body, validationResult } from "express-validator";
import { supabaseDelete, supabaseUpload } from "../config/supabase.js";
import upload, { MAX_FILE_SIZE } from "../config/upload.js";
import prisma from "../db/prisma.js"
import { getCurrentPathCTE } from "../db/queries.js";

const validateFolder = [
    body("name").trim()
        .isLength({ min: 1, max: 15 }).withMessage("Folder name must 1-15 characters only")
]

export const getRootContents = async (req, res) => {
    const [folders, files] = await prisma.$transaction([
        prisma.folder.findMany({
            where: { parentDirectoryId: null, ownerId: req.user.id }
        }),
        prisma.file.findMany({
            where: { directoryId: null, ownerId: req.user.id }
        })
    ])

    const currentPath = []

    res.render("index", { files, folders, currentPath })
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

    const currentPath = await getCurrentPathCTE(dirId, ownerId)

    res.render("index", { directoryId, folders, currentPath, files });
}

export const createRootFolderGet = (req, res) => {
    res.render("create-folder");
}

export const createFolderInDirectoryGet = (req, res) => {
    const { directoryId } = req.params;

    res.render("create-folder", { directoryId: directoryId })
}

export const createFolderPost = [
    validateFolder,
    async (req, res) => {
        const ownerId = req.user.id;
        const { name, parent_directory_id } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render(
                "create-folder", 
                { 
                    directoryId: !!parent_directory_id ? parent_directory_id : null,
                    errors: errors.array()
                }
            )
        }


        const folder = await prisma.folder.create({
            data: {
                ownerId: ownerId,
                name: name,
                parentDirectoryId: !!parent_directory_id ? Number(parent_directory_id) : null
            }
        });

        if (folder) {
            return res.redirect(`/folder/${folder.id}`);
        }

        res.redirect('/');
    }
]

export const editFolderGet = async (req, res) => {
    const { folderId } = req.params;

    const folder = await prisma.folder.findFirst({
        where: {
            id: Number(folderId),
            ownerId: req.user.id
        }
    })

    res.render("edit-folder", { folder })
}

export const editFolderPost = [
    validateFolder,
    async (req, res) => {
        const { folder_id, name } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).redirect(`/folder/${folder_id}`)
        }

        const folder = await prisma.folder.update({
            where: {
                id: Number(folder_id),
                ownerId: req.user.id
            },
            data: {
                name: name
            }
        })

        res.render("edit-folder", { folder })
    }
]

export const deleteFolder = async (req, res) => {
    const { folderId } = req.params;

    const [found] = await prisma.$transaction([
        prisma.folder.findUnique({
            where: { id: Number(folderId), ownerId: req.user.id },
            select: { parentDirectoryId: true }
        }),
        prisma.folder.delete({
            where: { id: Number(folderId) }
        })
    ]);

    const parentId = found?.parentDirectoryId ?? null;
    if (parentId) {
        return res.redirect(`/folder/${parentId}`);
    }

    res.redirect('/');
}

export const uploadFileGet = (req, res) => {
    res.render("upload-form");
}

export const uploadFileInDirectoryGet = (req, res) => {
    const { folderId } = req.params;

    res.render("upload-form", { folderId });
}

export const uploadFilePost = [
    (req, res, next) => upload.single("file_upload")(req, res, (err) => {
        if (err) {
            // Multer file size limit
            if (err.code === "LIMIT_FILE_SIZE") {
                const mb = Math.round(MAX_FILE_SIZE / 1024 / 1024);
                return res.status(400).render("upload-form", { errors: [{msg: `File too large (max ${mb} MB)`}] });
            }
            return next(err);
        }
        next();
    }),
    async (req, res, next) => {
        try {
            const file = req.file;
            if (!file) return res.status(400).render("upload-form", { errors: [{ msg: "No file uploaded"}] });

            const supabaseFile = await supabaseUpload(file, req.user.id);

            await prisma.file.create({
                data: {
                    name: file.originalname,
                    size: String(file.size),
                    fileURL: supabaseFile.path,
                    ownerId: req.user.id,
                    directoryId: !!req.body.directory_id ? Number(req.body.directory_id) : null,
                }
            })

            if (!!req.body.directory_id) {
                return res.redirect(`/folder/${req.body.directory_id}`);
            }
            res.redirect("/");
        } catch (err) {
            next(err);
        }
    }
]

export const fileGet = async (req, res) => {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
        where: { id: Number(fileId), ownerId: req.user.id }
    });

    res.render("file-details", { file });
}

export const fileDownload = async (req, res) => {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique({ where: { id: Number(fileId) } })
    res.redirect(`${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.SUPABASE_BUCKET}/${file.fileURL}`);
}

export const deleteFile = async (req, res) => {
    const { fileId } = req.params;

    const file = await prisma.file.findUnique(
        { where: { id: Number(fileId), ownerId: req.user.id } }
    )

    const deleted = await supabaseDelete(file.fileURL);

    if (deleted) {
        await prisma.file.delete({
            where: { id: file.id }
        })
    }

    res.redirect(!!file.directoryId ? `/folder/${file.directoryId}` : '/');
}