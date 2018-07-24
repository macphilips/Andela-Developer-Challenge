import express from 'express';
import AuthenticateController from '../../controller/authenticate-controller';

const router = express.Router();

router.post('/', AuthenticateController.authenticate);

module.exports = router;
