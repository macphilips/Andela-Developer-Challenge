import express from 'express';
import EntriesController from '../../controllers/entriesController';

const router = express.Router();

router.get('/', EntriesController.getEntries);
router.post('/', EntriesController.createEntry);
router.put('/:id', EntriesController.updateEntry);
router.get('/:id', EntriesController.getEntry);
router.delete('/:id', EntriesController.deleteEntry);
export default router;
