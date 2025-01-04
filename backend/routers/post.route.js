import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { addComment, addNewPost, deletePost, dislikePost, getAllPost, getCommentOfPost, getUserPost, likePost, savedPost } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'),addNewPost)
router.route('/all').get(isAuthenticated, getAllPost)
router.route('/userpost/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getCommentOfPost)
router.route('/delete/:id').delete(isAuthenticated, deletePost)
router.route('/:id/saved').post(isAuthenticated, savedPost)

export default router;