import mongoose, { Document } from 'mongoose'

export interface UserType extends Document {
    uid: string
    name: string
    lastname: string
    username: string
    email: string
    birthDate: Date
    profilePic?: {
        path?: string
        url?: string
    }
    backgroundImg?: {
        path?: string
        url?: string
    }
    originalProfilePicPath?: string
    originalBackgroundImgPath?: string
    description: string
    comments: string[]
    joinDate: Date
}

const UserMongoSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    profilePic: {
        path: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
        required: false,
    },
    backgroundImg: {
        path: {
            type: String,
            required: false,
        },
        url: {
            type: String,
            required: false,
        },
        required: false,
    },
    originalProfilePicPath: {
        type: String,
        required: false,
    },
    originalBackgroundImgPath: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: true,
    },
    comments: {
        type: [String],
        required: true,
    },
    joinDate: {
        type: Date,
        required: true,
    },
})

export default mongoose.model<UserType>('User', UserMongoSchema)
