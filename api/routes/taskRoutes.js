const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/add-task', taskController.createTask);
router.get('/:projectId/tasks', taskController.getTasksByProjectId);
router.put('/:taskId', taskController.updateTask);
//router.delete('/delete-task/:taskId', taskController.deleteTask);

module.exports = router;
