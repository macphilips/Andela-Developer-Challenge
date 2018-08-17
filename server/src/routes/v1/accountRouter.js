import express from 'express';
import AccountController from '../../controllers/accountController';

const accountRouter = express.Router();

accountRouter.post('/', AccountController.updateUser);
accountRouter.get('/me', AccountController.getCurrentLoggedInUser);
accountRouter.get('/me/detailed', AccountController.getCurrentLoggedInUserFullDetails);
accountRouter.post('/change-password', AccountController.changePassword);

export default accountRouter;
