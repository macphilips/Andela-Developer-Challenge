import express from 'express';
import EntriesController from '../../controllers/entriesController';

const entriesRouter = express.Router();

entriesRouter.get('/', EntriesController.getEntries);
entriesRouter.post('/', EntriesController.createEntry);
entriesRouter.put('/:id', EntriesController.updateEntry);
entriesRouter.get('/:id', EntriesController.getEntry);
entriesRouter.delete('/:id', EntriesController.deleteEntry);
export default entriesRouter;
