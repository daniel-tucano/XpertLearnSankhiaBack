import express from 'express'
const publicRoutes = express.Router()

const CommentsController = require('./controllers/CommentsController')
const PostsController = require('./controllers/PostsController')
const UserController = require('./controllers/UserController')

// Root route
publicRoutes.get('/', (_req, res) => {
    res.status(200).send('welcome to xpert sankhia mobile REST API!')
})

// Song Public Routes
publicRoutes.get('/comments', CommentsController.index)
publicRoutes.get('/comments/:id', CommentsController.show)

// Playlist Public Routes
publicRoutes.get('/posts', PostsController.index)
publicRoutes.get('/posts/:id', PostsController.show)

// Users Public Routes
publicRoutes.post('/users', UserController.store)
publicRoutes.get('/users', UserController.index)
publicRoutes.get('/users/:id', UserController.show)

export default publicRoutes
