import express from 'express';
import ReminderController from '../../controllers/reminderController';

const routerRouter = express.Router();

routerRouter.put('/user/reminder/settings', ReminderController.updateReminder);
routerRouter.get('/user/reminder/settings', ReminderController.getReminder);

export default routerRouter;
