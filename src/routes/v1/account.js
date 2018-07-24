import express from 'express';
import AccountController from '../../controllers/account-controller';

const router = express.Router();

router.post('/register', AccountController.registerUser);
router.get('/me', AccountController.getCurrentLoggedInUser);

module.exports = router;
