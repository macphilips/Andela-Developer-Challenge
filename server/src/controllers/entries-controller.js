import { getTimeString } from '../functions/util';
import db from '../db';
import { HttpError } from '../errors/HttpError';

export default class EntriesController {
  static getEntries(req, res) {
    db.connection.entries.findAllByCreator(req.userId)
      .then((entries) => {
        if (entries.length > 0) {
          return Promise.resolve(EntriesController.convertEntries(entries));
        }
        return Promise.reject(new HttpError('No Entries found', 404));
      })
      .then((entries) => {
        res.status(200).send({ entries });
      })
      .catch((err) => {
        EntriesController.sendError(err, res);
      });
  }

  static createEntry(req, res) {
    const { title, content, id } = req.body;
    Promise.resolve(id).then((result) => {
      if (result) return Promise.reject(new HttpError('Use PUT Request to update entry', 403));
      const userID = parseInt(req.userId, 10);
      return db.connection.entries.save({
        title,
        content,
        userID,
      });
    }).then(result => res.status(201).send(EntriesController.convertEntry(result)))
      .catch((err) => {
        EntriesController.sendError(err, res);
      });
  }

  static updateEntry(req, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    const userID = req.userId;
    db.connection.entries.findById(id).then((data) => {
      if (!data) {
        return Promise.reject(new HttpError(`No entries found with id:${id}`, 404));
      }
      if (data && data.userID === userID) {
        return db.connection.entries.save({
          title, content, id, userID,
        });
      }
      return Promise.reject(new HttpError('You do not have permission to modified this entry', 403));
    }).then((result) => {
      res.status(200).send(EntriesController.convertEntry(result));
    }).catch((err) => {
      EntriesController.sendError(err, res);
    });
  }

  static getEntry(req, res) {
    const { id } = req.params;
    const userID = req.userId;
    db.connection.entries.findById(id).then((data) => {
      if (!data) {
        return Promise.reject(new HttpError(`No entries found with id:${id}`, 404));
      }
      if (data && data.userID === userID) {
        return Promise.resolve(data);
      }
      return Promise.reject(new HttpError('This entry does not belong to you', 403));
    }).then((result) => {
      res.status(200).send(EntriesController.convertEntry(result));
    }).catch((err) => {
      EntriesController.sendError(err, res);
    });
  }

  static sendError(err, res) {
    const code = err.code || 500;
    const { message } = err;
    res.status(code).send({ message });
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
