import Util from '../util/util';
import entriesRepository from '../repository/entries';

export default class EntriesController {
  static getEntries(req, res) {
    const entries = entriesRepository.findAllByCreator(req.userId);
    res.status(200).send(EntriesController.convertEntries(entries));
  }

  static createEntry(req, res) {
    const { title, content, id } = req.body;
    if (id) return res.status(400).send({});
    const creatorID = req.userId;
    return res.status(201).send(EntriesController.convertEntry(entriesRepository.save({
      title,
      content,
      creatorID,
    })));
  }

  static convertEntry(entry) {
    const value = { ...entry };
    value.createdDate = Util.getTimeString(value.createdDate);
    value.lastModified = Util.getTimeString(value.lastModified);
    return value;
  }

  static convertEntries(entries) {
    const result = [];
    entries.forEach((entry) => {
      result.push(EntriesController.convertEntry(entry));
    });
    return result;
  }

  static updateEntry(req, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    const creatorID = req.userId;
    const entry = entriesRepository.findById(id);
    if (entry && entry.creatorID === creatorID) {
      res.status(200).send(EntriesController.convertEntry(entriesRepository.save({
        title, content, id,
      })));
    } else {
      res.status(400).send({
        message: 'Entry you\'re trying to modified does not belong to you',
      });
    }
  }

  static getEntry(req, res) {
    const { id } = req.params;
    const creatorID = req.userId;
    const entry = entriesRepository.findById(id);
    if (entry) {
      if (entry.creatorID === creatorID) {
        res.status(200).send(EntriesController.convertEntry(entry));
      } else {
        res.status(403).send({ message: `Entry with id ${id} doesn't belong to you` });
      }
    } else {
      res.status(404).send({ message: `Entry with id ${id} not found` });
    }
  }
}
