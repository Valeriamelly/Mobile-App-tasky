const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.post('/add-project', projectController.createProject);
router.get('/get-all', projectController.getProjects);

module.exports = router;

