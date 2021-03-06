import mongoose, { Document } from 'mongoose'

export interface PostType extends Document {
    likes: { creatorUid: string }[]
    creatorUid: string
    content: { type: 'video' | 'image'; payload: string[] }
    description: string
    createdAt: Date
}

const PostMongoSchema = new mongoose.Schema(
    {
        likes: [{ creatorUid: String }],
        creatorUid: String,
        content: {
            type: {
                $type: String,
                required: true,
            },
            payload: {
                $type: [String],
                required: true,
            },
        },
        description: {
            $type: String,
            required: true,
        },
        createdAt: Date,
    },
    { typeKey: '$type' }
)

export default mongoose.model<PostType>('Post', PostMongoSchema)
