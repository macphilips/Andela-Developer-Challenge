import express from 'express';
import ReminderController from '../../controllers/reminderController';

const reminderRouter = express.Router();

reminderRouter.put('/user/reminder/settings', ReminderController.updateReminder);
reminderRouter.get('/user/reminder/settings', ReminderController.getReminder);

export default reminderRouter;
