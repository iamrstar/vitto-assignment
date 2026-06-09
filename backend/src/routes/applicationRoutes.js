const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/applications', applicationController.createApplication);
router.get('/applications', applicationController.getApplications);
router.patch('/applications/:id/status', applicationController.updateApplicationStatus);
router.get('/summary', applicationController.getSummary);

module.exports = router;
