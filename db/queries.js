import { prisma } from "./prisma.js"
import path from "node:path"

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
    if (goodFile) {
        return await prisma.file.create({
        data: {
            fileName: newFile.originalname,
            fileSize: newFile.size,
            fileType: goodFile,
            locationPath: newFile.path,
            userId: userId,
            folderId: folderId ? parseInt(folderId) : null,
        }
    })
    } else {
        throw new Error("")
    }
}

export const getAllUserFiles = async (userId) => {
    return await prisma.file.findMany({
        where: {
            userId: userId,
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

export const getFilesByFolderId = async(folderId) => {
    return await prisma.file.findMany({
        where: {
            folderId: folderId,
        }
    })
}