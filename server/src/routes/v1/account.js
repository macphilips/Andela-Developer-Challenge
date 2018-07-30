import express from 'express';
import AccountController from '../../controllers/account-controller';

const router = express.Router();

router.get('/me', AccountController.getCurrentLoggedInUser);
router.post('/change-password', AccountController.changePassword);

export default router;
