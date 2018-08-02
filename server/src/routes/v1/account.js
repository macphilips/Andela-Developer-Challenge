import express from 'express';
import AccountController from '../../controllers/accountController';

const router = express.Router();

router.get('/me', AccountController.getCurrentLoggedInUser);
router.post('/change-password', AccountController.changePassword);

export default router;
