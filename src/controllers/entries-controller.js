import { getTimeString } from '../functions/util';
import db from '../db';

export default class EntriesController {
  static getEntries(req, res) {
    db.connection.entries.findAllByCreator(req.userId)
      .then((entries) => {
        res.status(200).send(EntriesController.convertEntries(entries));
      }).catch((err) => {
        res.status(500).send({ message: err.message });
      });
  }

  static createEntry(req, res) {
    const { title, content, id } = req.body;
    Promise.resolve(id).then((result) => {
      if (result) return Promise.reject(Error('Use PUT Request to update entry'));

      const creatorID = req.userId;
      return db.connection.entries.save({
        title,
        content,
        creatorID,
      });
    }).then(result => res.status(201).send(EntriesController.convertEntry(result)))
      .catch(err => res.status(400).send({ message: err.message }));
  }

  static updateEntry(req, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    const creatorID = req.userId;
    db.connection.entries.findByIdAndByOwner(id, creatorID).then((data) => {
      console.log('update entry => ', data);
      if (data) {
        return db.connection.entries.save({
          title, content, id, creatorID,
        });
      }
      return Promise.reject(new Error('Entry you\'re trying to modified not found'));
    }).then((result) => {
      res.status(200).send(EntriesController.convertEntry(result));
    }).catch(err => res.status(404).send({ message: err.message }));
  }

  static getEntry(req, res) {
    const { id } = req.params;
    const creatorID = req.userId;
    db.connection.entries.findByIdAndByOwner(id, creatorID).then((data) => {
      if (data) {
        return Promise.resolve(data);
      }
      return Promise.reject(new Error());
    }).then((result) => {
      res.status(200).send(EntriesController.convertEntry(result));
    }).catch(() => res.status(404).send({ message: 'Entry you\'re access not found' }));
  }

  static convertEntry(entry) {
    const value = { ...entry };
    value.createdDate = getTimeString(value.createdDate);
    value.lastModified = getTimeString(value.lastModified);
    return value;
  }

  static convertEntries(entries) {
    const result = [];
    entries.forEach((entry) => {
      result.push(EntriesController.convertEntry(entry));
    });
    return result;
  }
}
