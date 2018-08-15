import {
  getTimeString, MAX_INT, sameDayDateComparison, validateEntry,
} from '../utils';
import db from '../db';
import HttpError from '../utils/httpError';

export default class EntriesController {
  static getEntries(req, res) {
    const pageable = {};
    pageable.page = req.query.page || 1;
    pageable.size = req.query.size || MAX_INT;
    db.connection.entries.findAllByCreator(req.userId, pageable)
      .then((result) => {
        const data = result;
        data.entries = EntriesController.convertEntries(result.entries);
        return Promise.resolve(data);
      })
      .then((entries) => {
        res.status(200).send({
          data: entries,
          message: 'Successfully retrieved Users entry list',
          status: 'Successful',
        });
      })
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }

  static createEntry(req, res) {
    const { title, content, id } = req.body;
    const message = validateEntry(req.body);
    if (message) {
      HttpError.sendError(new HttpError(message, 400, 'Failed'), res);
    } else {
      Promise.resolve(id).then((result) => {
        if (result) return Promise.reject(new HttpError('Use PUT Request to update entry', 403, 'Unknown Operation'));
        const userID = parseInt(req.userId, 10);

        const now = new Date();
        return db.connection.entries.save({
          title,
          content,
          userID,
          createdDate: now,
          lastModified: now,
        });
      }).then(result => res.status(201).send({
        entry: EntriesController.convertEntry(result),
        message: 'Successfully created user entry',
        status: 'Successful',
      }))
        .catch((err) => {
          HttpError.sendError(err, res);
        });
    }
  }

  static updateEntry(req, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    const { userId } = req;

    const message = validateEntry(req.body);
    if (message) {
      HttpError.sendError(new HttpError(message, 400, 'Failed'), res);
    } else {
      EntriesController.validateIDAndGetEntry(id, userId, true)
        .then(() => db.connection.entries.save({
          title, content, id, userID: userId,
        }))
        .then((result) => {
          res.status(200).send({
            entry: EntriesController.convertEntry(result),
            message: 'Successfully update user entry',
            status: 'Successful',
          });
        })
        .catch((err) => {
          HttpError.sendError(err, res);
        });
    }
  }

  static getEntry(req, res) {
    const { id } = req.params;
    const { userId } = req;

    EntriesController.validateIDAndGetEntry(id, userId)
      .then((result) => {
        res.status(200).send({
          entry: EntriesController.convertEntry(result),
          message: 'Successfully retrieved entry',
          status: 'Successful',
        });
      })
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }

  static deleteEntry(req, res) {
    const { id } = req.params;
    const { userId } = req;

    EntriesController.validateIDAndGetEntry(id, userId)
      .then(data => db.connection.entries.remove(data.id))
      .then(() => {
        res.status(200).send({ status: 'Successful', message: 'Successfully Deleted Entry' });
      })
      .catch((err) => {
        HttpError.sendError(err, res);
      });
  }

  static canModify(data) {
    if (sameDayDateComparison(data.createdDate)) {
      return Promise.reject(new HttpError('Cannot modify this entry anymore. '
        + 'Entries can only be modified within the same day it was created', 403, 'Failed'));
    }
    return null;
  }

  static validateIDAndGetEntry(id, userId, update) {
    return Promise.resolve(id)
      .then((entryID) => {
        if (Number.isNaN(Number(entryID))) {
          return Promise.reject(new HttpError('Invalid ID', 400, 'Failed'));
        }
        return db.connection.entries.findById(entryID);
      })
      .then((data) => {
        let error = EntriesController.checkPermission(data, userId);
        if (update) error = error || EntriesController.canModify(data);
        return (error !== null) ? error : Promise.resolve(data);
      });
  }

  static checkPermission(data, userID) {
    if (!data) {
      return Promise.reject(new HttpError('No entries found', 404, 'Failed'));
    }
    if (data.userID !== userID) {
      return Promise.reject(new HttpError('Cannot access entry', 403, 'Failed'));
    }
    return null;
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
