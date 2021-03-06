import Post, { PostType } from '../models/Posts'
import { Request, Response } from 'express'
import { paginate } from '../functions/paginate'

module.exports = {
    async index(req: Request, res: Response) {
        let { page = 1, limit = 10 } = req.query
        const estimatedDocumentCount =
            req.query.estimatedDocumentCount !== 'false'
        page = Number(page)
        limit = Number(limit)

        // Checks if page and limit query parameters are valid
        if (!(Number.isInteger(page) && Number.isInteger(limit)))
            return res
                .status(400)
                .send('PAGE AND LIMIT PARAMETERS MUST BE NUMBERS')

        const posts = await paginate(Post, req.ODataFilter, req.ODataSort, {
            page,
            limit,
            estimatedDocumentCount,
        })

        return res.json(posts)
    },

    async show(req: Request, res: Response) {
        const post = await Post.findById(req.params.id)

        return res.json(post)
    },

    async store(req: Request<any, any, PostType>, res: Response) {
        req.body.likes = []
        req.body.creatorUid = req.decodedIdToken.uid
        const post = await Post.create({ ...req.body, createdAt: new Date() })

        return res.json(post)
    },

    async update(req: Request, res: Response) {
        const postToUpdate = await Post.findById(req.params.id)

        if (!postToUpdate) return res.status(404).send("POST DON'T EXISTS")

        if (postToUpdate.creatorUid !== req.decodedIdToken?.uid)
            return res
                .status(401)
                .send('CLIENT NOT AUTHORIZED TO PERFORM OPERATION')

        const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            useFindAndModify: false,
        })

        return res.json(post)
    },

    async likePost(req: Request, res: Response) {
        const { id: postId } = req.params

        const { state = 'true' } = req.query

        if (!postId) return res.status(400).send('postId must be provided"')

        let updatedPost

        console.log(state)
        if (state === 'true') {
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $addToSet: {
                        likes: { creatorUid: req.decodedIdToken.uid },
                    },
                },
                { new: true, useFindAndModify: false, lean: true }
            )
        } else if (state === 'false') {
            updatedPost = await Post.findByIdAndUpdate(
                postId,
                {
                    $pull: { likes: { creatorUid: req.decodedIdToken.uid } },
                },
                { new: true, useFindAndModify: false, lean: true }
            )
        } else {
            return res.status(400).send('state must be true or false')
        }

        return res.status(200).send(updatedPost)
    },

    async destroy(req: Request, res: Response) {
        const postToDelete = await Post.findById(req.params.id)

        if (!postToDelete) return res.status(404).send("POST DON'T EXISTS")

        if (postToDelete.creatorUid !== req.decodedIdToken?.uid)
            return res
                .status(401)
                .send('CLIENT NOT AUTHORIZED TO PERFORM OPERATION')

        await Post.findByIdAndRemove(req.params.id)

        return res.send()
    },
}
