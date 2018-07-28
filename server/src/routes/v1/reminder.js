import express from 'express';
import ReminderController from '../../controllers/reminder-controller';

const router = express.Router();

router.put('/user/:id/reminder', ReminderController.createReminder);
router.get('/user/:id/reminder', ReminderController.getReminder);

export default router;
