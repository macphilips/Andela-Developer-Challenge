import express from 'express';
import AuthenticateController from '../../controllers/authenticateController';
import AccountController from '../../controllers/accountController';

const authenticationRouter = express.Router();

authenticationRouter.post('/signup', AccountController.registerUser);
authenticationRouter.post('/login', AuthenticateController.authenticate);

export default authenticationRouter;
