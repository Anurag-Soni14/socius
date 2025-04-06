import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { addComment, addNewPost, deletePost, dislikePost, editPost, getAllPost, getCommentOfPost, getFollowingUsersPosts, getPostStats, getSinglePost, getUserPost, likePost, postDelete, savedPost } from '../controllers/post.controller.js';
import upload from '../middlewares/multer.js';
import isAdmin from '../middlewares/isAdmin.js';

const router = express.Router();

router.route('/addpost').post(isAuthenticated, upload.single('image'), addNewPost)
router.route('/all').get(isAuthenticated, getAllPost)
router.route('/following-posts').get(isAuthenticated, getFollowingUsersPosts)
router.route('/userpost/all').get(isAuthenticated, getUserPost)
router.route('/:id/like').get(isAuthenticated, likePost)
router.route('/:id/dislike').get(isAuthenticated, dislikePost)
router.route('/:id/comment').post(isAuthenticated, addComment)
router.route('/:id/comment/all').post(isAuthenticated, getCommentOfPost)
router.route('/delete/:id').delete(isAuthenticated, deletePost)
router.route('/:id/save').get(isAuthenticated, savedPost)


router.route('/admin/post-stats').get(isAuthenticated, isAdmin, getPostStats);
router.route('/admin/delete/:id').delete(isAuthenticated, isAdmin, postDelete);
router.route('/admin/fetch-post/:id').get(isAuthenticated, isAdmin, getSinglePost);
router.route('/admin/edit/:id').put(isAuthenticated, isAdmin, upload.single('image'), editPost);

export default router;