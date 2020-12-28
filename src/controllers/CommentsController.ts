import Comment from '../models/Comments'
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

        const comments = await paginate(
            Comment,
            req.ODataFilter,
            req.ODataSort,
            {
                page,
                limit,
                estimatedDocumentCount,
            }
        )

        return res.json(comments)
    },

    async show(req: Request, res: Response) {
        const comment = await Comment.findById(req.params.id)

        return res.json(comment)
    },

    async store(req: Request, res: Response) {
        const comment = await Comment.create({
            ...req.body,
            createdAt: new Date(),
        })

        return res.json(comment)
    },

    async update(req: Request, res: Response) {
        const commentToUpdate = await Comment.findById(req.params.id)

        if (!commentToUpdate)
            return res.status(404).send("COMMENT DON'T EXISTS")

        if (commentToUpdate.creatorUid !== req.decodedIdToken?.uid)
            return res
                .status(401)
                .send('CLIENT NOT AUTHORIZED TO PERFORM OPERATION')

        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                useFindAndModify: false,
            }
        )

        return res.json(comment)
    },

    async destroy(req: Request, res: Response) {
        const commentToDelete = await Comment.findById(req.params.id)

        if (!commentToDelete)
            return res.status(404).send("COMMENT DON'T EXISTS")

        if (commentToDelete.creatorUid !== req.decodedIdToken?.uid)
            return res
                .status(401)
                .send('CLIENT NOT AUTHORIZED TO PERFORM OPERATION')

        await Comment.findByIdAndRemove(req.params.id)

        return res.send()
    },
}
