import express from 'express';
import EntriesController from '../../controllers/entries-controller';

const router = express.Router();

router.get('/', EntriesController.getEntries);
router.post('/', EntriesController.createEntry);
router.put('/:id', EntriesController.updateEntry);
router.get('/:id', EntriesController.getEntry);
module.exports = router;
