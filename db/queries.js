import { prisma } from "./prisma.js"
import path from "node:path"
import supabase from "./supabaseClient.js"

export const createUser = async (username, password, email) => {
    return await prisma.user.create({
        data: {
            username: username,
            password: password,
            email: email,
        }
    })
}

export const createDefaultFolder = async (userId) => {
    return await prisma.folder.create({
        data: {
            name: "My Folder",
            userId: userId,
        }
    })
}

export const createNewFolder = async (userId, folderName) => {
    return await prisma.folder.create({
        data: {
            userId: userId,
            name: folderName,
        }
    })
}

export const getUserFolders = async (userId) => {
    return await prisma.folder.findMany({
        where: {
            userId: userId,
        }
    })
}

function checkFileExt(file) {
    const allowedExtensions = /jpg|jpeg|png|gif|docx|pdf|txt|svg/;
    const allowedMimetypes = {
        jpg: "image/jpeg",
        jpeg: "image/jpeg",
        png: "image/png",
        gif: "image/gif",
        docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        pdf: "application/pdf",
        txt: "text/plain",
        svg: "image/svg+xml",
    };

    const extName = path.extname(file.originalname).toLowerCase().replace(".", "");
    const expectedMime = allowedMimetypes[extName];

    if (allowedExtensions.test(extName) && expectedMime === file.mimetype) {
        return extName;
    } else {
        return false;
    }
}

export const createNewFile = async (newFile, userId, folderId) => {
    const goodFile = checkFileExt(newFile);

    // Supabase file saving
    if (goodFile) {
        const { data, error } = await supabase.storage
            .from("vaultly-files")
            .upload(`${userId}/${newFile.originalname}`, newFile.buffer, {
                contentType: newFile.mimetype,
            });

        if (error) throw new Error(error.message);

        const { data: urlData } = supabase.storage
            .from("vaultly-files")
            .getPublicUrl(data.path);
        
        return await prisma.file.create({
            data: {
                fileName: newFile.originalname,
                fileSize: newFile.size,
                fileType: goodFile,
                locationPath: urlData.publicUrl,
                userId: userId,
                folderId: folderId ? parseInt(folderId) : null,
            }
        })
    } else {
        throw new Error("Invalid file type")
    }

    // Saving files in filesystem

    // if (goodFile) {
    //     return await prisma.file.create({
    //     data: {
    //         fileName: newFile.originalname,
    //         fileSize: newFile.size,
    //         fileType: goodFile,
    //         locationPath: newFile.path,
    //         userId: userId,
    //         folderId: folderId ? parseInt(folderId) : null,
    //     }
    // })
    // } else {
    //     throw new Error("")
    // }
}

export const getAllUserFiles = async (userId) => {
    return await prisma.file.findMany({
        where: {
            userId: userId,
        },
        include: {folder: true},
    })
}

export const getFileById = async (fileId) => {
    return await prisma.file.findUnique({
        where: {
            id: fileId,
        }
    })
}

export const getFolderById = async (folderId) => {
    return await prisma.folder.findUnique({
        where: {
            id: folderId,
        }
    })
}

export const changeFolderName = async (folderId, newName) => {
    return await prisma.folder.update({
        where: {id: folderId},
        data: {
            name: newName,
        }
    })
}

export const deleteFolderById = async (folderId) => {

    await prisma.file.updateMany({
        where: {
            folderId: folderId,
        },
        data: {
            folderId: null,
        }
    })

    return await prisma.folder.delete({
        where: {
            id: folderId,
        }
    })
}

export const getFilesByFolderId = async(folderId) => {
    return await prisma.file.findMany({
        where: {
            folderId: folderId,
        },
        include: {folder: true},
    })
}

export const deleteSingleFile = async (fileId) => {
    return await prisma.file.delete({
        where: {
            id: fileId,
        }
    })
}