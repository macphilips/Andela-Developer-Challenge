import express from 'express';
import VerifyToken from '../../security/jwt-filter';
import entriesRepository from '../../repository/entries';
import Util from '../../util/util';


function convertEntry(entry) {
  const value = { ...entry };
  value.createdDate = Util.getTimeString(value.createdDate);
  value.lastModified = Util.getTimeString(value.lastModified);
  return value;
}

function convertEntries(entries) {
  const result = [];
  entries.forEach((entry) => {
    result.push(convertEntry(entry));
  });
  return result;
}


const router = express.Router();

router.get('/', VerifyToken, (req, res) => {
  const entries = entriesRepository.findAllByCreator(req.userId);
  res.status(200).send(convertEntries(entries));
});
router.post('/', VerifyToken, (req, res) => {
  const { title, content, id } = req.body;
  if (id) return res.status(400).send({});
  const creatorID = req.userId;
  return res.status(201).send(convertEntry(entriesRepository.save({ title, content, creatorID })));
});
router.put('/:id', VerifyToken, (req, res) => {
  const { title, content } = req.body;
  const { id } = req.params;
  const creatorID = req.userId;
  const entry = entriesRepository.findById(id);
  if (entry && entry.creatorID === creatorID) {
    res.status(200).send(convertEntry(entriesRepository.save({ title, content, id })));
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
  if (entry) {
    if (entry.creatorID === creatorID) {
      res.status(200).send(entry);
    } else {
      res.status(403).send({ message: `Entry with id ${id} doesn't belong to you` });
    }
  } else {
    res.status(404).send({ message: `Entry with id ${id} not found` });
  }
});
module.exports = router;
