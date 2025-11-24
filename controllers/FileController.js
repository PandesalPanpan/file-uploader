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