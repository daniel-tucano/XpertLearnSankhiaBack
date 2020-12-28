import mongoose, { Document } from 'mongoose'

export interface CommentType extends Document {
    creatorUid: string
    content: { type: string; payload: string }
    createdAt: Date
}

const CommentMongoSchema = new mongoose.Schema(
    {
        creatorUid: String,
        content: {
            type: {
                $type: String,
                required: true,
            },
            payload: {
                $type: String,
                required: true,
            },
        },
        createdAt: Date,
    },
    { typeKey: '$type' }
)

export default mongoose.model<CommentType>('Comment', CommentMongoSchema)
