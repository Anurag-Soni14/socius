import express from 'express';
import {deleteContact, deleteUser, editProfile, editUser, followOrUnfollow, getAllUsers, getContacts, getContactStats, getProfile, getSingleContacts, getSingleUser, getUser, getUserStats, login, logout, register, searchUsers, submitContactForm, suggestedUsers} from '../controllers/user.controller.js'
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';
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
router.route('/contact-us').post(isAuthenticated, submitContactForm);



router.route('/admin/users').get(isAuthenticated, isAdmin, getAllUsers);
router.route('/admin/get-user/:id').get(isAuthenticated, isAdmin, getSingleUser);
router.route('/admin/edit/:id').post(isAuthenticated, isAdmin, editUser);
router.route('/admin/delete/:id').delete(isAuthenticated, isAdmin, deleteUser);
router.route('/admin/user-stats').get(isAuthenticated, isAdmin, getUserStats);
router.route('/admin/contact-stats').get(isAuthenticated, isAdmin, getContactStats);
router.route('/admin/get-contacts').get(isAuthenticated, isAdmin, getContacts);
router.route('/admin/get-contact/:id').get(isAuthenticated, isAdmin, getSingleContacts);
router.route('/admin/delete-contact/:id').delete(isAuthenticated, isAdmin, deleteContact);

export default router;