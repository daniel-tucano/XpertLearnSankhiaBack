import express from 'express'
import multerImg from './functions/multerImg'
const privateRoutes = express.Router()

const CommentsController = require('./controllers/CommentsController')
const PostsController = require('./controllers/PostsController')
const UserController = require('./controllers/UserController')

// Comments Private Routes
privateRoutes.post('/comments', CommentsController.store)
privateRoutes.put('/comments/:id', CommentsController.update)
privateRoutes.delete('/comments/:id', CommentsController.destroy)

// Posts Private Routes
privateRoutes.post('/posts', PostsController.store)
privateRoutes.put('/posts/:id', PostsController.update)
privateRoutes.delete('/posts/:id', PostsController.destroy)
privateRoutes.get('/posts/like/:id', PostsController.likePost)

// Users Private Routes
privateRoutes.put('/users/:id', UserController.update)
privateRoutes.delete('/users/:id', UserController.destroy)
privateRoutes.post(
    '/users/upload/profile-image/:id',
    multerImg('profile-image'),
    UserController.uploadProfilePic
)

export default privateRoutes
