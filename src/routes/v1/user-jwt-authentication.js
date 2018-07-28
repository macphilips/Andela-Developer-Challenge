import express from 'express';
import AuthenticateController from '../../controllers/authenticate-controller';

const router = express.Router();

router.post('/', AuthenticateController.authenticate);

export default router;
