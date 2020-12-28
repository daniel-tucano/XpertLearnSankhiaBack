import Post from '../models/Posts'
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

    async store(req: Request, res: Response) {
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
