import express from 'express';
import {editProfile, followOrUnfollow, getProfile, getUser, login, logout, register, searchUsers, suggestedUsers} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import upload from '../middlewares/multer.js';

const router = express.Router();



router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/:id/profile').get(isAuthenticated, getProfile);
router.route('/getuser').get(isAuthenticated, getUser);
router.route('/profile/edit').post(isAuthenticated, upload.fields([{ name: 'profilePic' }, { name: 'coverPhoto' }]), editProfile);
router.route('/suggested').get(isAuthenticated, suggestedUsers);
router.route('/followorunfollow/:id').post(isAuthenticated, followOrUnfollow);
router.route('/search').get(isAuthenticated, searchUsers);

export default router;