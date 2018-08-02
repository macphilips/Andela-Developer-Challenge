import express from 'express';
import AuthenticateController from '../../controllers/authenticateController';
import AccountController from '../../controllers/accountController';

const router = express.Router();

router.post('/signup', AccountController.registerUser);
router.post('/login', AuthenticateController.authenticate);

export default router;
