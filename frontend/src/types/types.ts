export interface User {
    _id: string
    email: string
    fullname: {
        firstname: string
        lastname: string
    }
}

export interface Project {
    _id: string
    name: string
    createdAt: string
    updatedAt: string
    users: User[]
    fileTree?: { [key: string]: { file: { contents: string } } }
}

export interface Message {
    _id: string
    sender: User
    message: string
}

export interface FileTree {
    [key: string]: {
        file: {
            contents: string
        }
    }
}

