import express from 'express';
import AuthenticateController from '../../controllers/authenticate-controller';
import AccountController from '../../controllers/account-controller';

const router = express.Router();

router.post('/signup', AccountController.registerUser);
router.post('/login', AuthenticateController.authenticate);

export default router;
