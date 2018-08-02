import express from 'express';
import ReminderController from '../../controllers/reminderController';

const router = express.Router();

router.put('/user/reminder/settings', ReminderController.updateReminder);
router.get('/user/reminder/settings', ReminderController.getReminder);

export default router;
