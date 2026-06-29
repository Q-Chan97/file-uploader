import { prisma } from "./prisma.js"

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