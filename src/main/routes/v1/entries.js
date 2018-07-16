import express from 'express';
import VerifyToken from '../../security/jwt-filter';
import entriesRepository from '../../repository/entries';

const router = express.Router();

router.get('/', VerifyToken, (req, res) => {
  const entries = entriesRepository.findAllByCreator(req.userId);
  res.status(200).send(entries);
});
router.post('/', VerifyToken, (req, res) => {
  const { title, content, id } = req.body;
  if (id) return res.status(400).send({});
  const creatorID = req.userId;
  return res.status(201).send(entriesRepository.save({ title, content, creatorID }));
});
router.put('/:id', VerifyToken, (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const creatorID = req.userId;
  const entry = entriesRepository.findById(id);
  if (entry && entry.creatorID === creatorID) {
    res.status(200).send(entriesRepository.save({ title, content, id }));
  } else {
    res.status(400).send({
      message: 'Entry you\'re trying to modified does not belong to you',
    });
  }
});
router.get('/:id', VerifyToken, (req, res) => {
  const { id } = req.params;
  const creatorID = req.userId;
  const entry = entriesRepository.findById(id);
  if (entry && entry.creatorID === creatorID) {
    res.status(200).send(entry);
  } else {
    res.status(404).send({ message: `Entry with id ${id} not found` });
  }
});

module.exports = router;
