import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import isAdmin from '../middlewares/isAdmin.js';
import upload from '../middlewares/multer.js';
import { deleteReport, editReport, fetchReports, getReportStats, getSingleReport, submitReport } from '../controllers/report.controller.js';

const router = express.Router();

router.route('/submit').post(isAuthenticated, upload.single('image'), submitReport);

router.route('/admin/fetch-report').get(isAuthenticated, isAdmin, fetchReports);
router.route('/admin/get-report/:id').get(isAuthenticated, isAdmin, getSingleReport);
router.route('/admin/report-stats').get(isAuthenticated, isAdmin, getReportStats);
router.route('/admin/delete/:id').delete(isAuthenticated, isAdmin, deleteReport);
router.route('/admin/edit/:id').delete(isAuthenticated, isAdmin, editReport);

export default router;