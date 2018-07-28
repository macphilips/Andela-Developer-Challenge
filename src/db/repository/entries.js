import sql from '../sql';
import Entry from '../../models/Entry';
import { wrapAndThrowError,HttpError } from '../../errors/HttpError';


export default class EntryRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1', +id)
      .then(result => Promise.resolve(Entry.mapDBEntriesEntityToEntries(result)))
      .catch(wrapAndThrowError);
  }

  findByIdAndByOwner(id, userID) {
    return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1 AND user_id = $2', [+id, +userID])
      .then(result => Promise.resolve(Entry.mapDBEntriesEntityToEntries(result)))
      .catch(wrapAndThrowError);
  }

  save(input) {
    const entry = { ...input };
    const now = new Date();
    if (!entry.id) {
      entry.createdDate = now;
      entry.lastModified = now;
      return this.db.one(sql.entries.add, { ...entry })
        .then(result => Promise.resolve(Entry.mapDBEntriesEntityToEntries(result)))
        .catch(wrapAndThrowError);
    }
    entry.lastModified = now;
    return this.findById(entry.id).then((data) => {
      if (data) {
        const newEntry = { ...data, ...entry };
        return this.db.one(sql.entries.update, { ...newEntry })
          .then(result => Promise.resolve(Entry.mapDBEntriesEntityToEntries(result)))
          .catch(wrapAndThrowError);
      }
      return Promise.reject(new HttpError(`Invalid id ${entry.id}`, 404));
    });
  }

  findAllByCreator(userId) {
    return this.db.any('SELECT * FROM entries WHERE user_id = $1', +userId)
      .then(result => Promise.resolve(Entry.mapDBArrayEntriesToEntries(result)))
      .catch(wrapAndThrowError);
  }

  clear() {
    return this.db.none(sql.entries.empty)
      .catch(wrapAndThrowError);
  }
}
