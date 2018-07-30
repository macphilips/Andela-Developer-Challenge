import sql from '../sql';
import Entry from '../../models/Entry';
import HttpError from '../../errors/HttpError';


export default class EntryRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1', +id)
      .then(result => (Entry.mapDBEntriesEntityToEntries(result)))
      .catch(HttpError.wrapAndThrowError);
  }

  // findByIdAndByOwner(id, userID) {
  //   return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1 AND user_id = $2',
  //     [+id, +userID])
  //     .then(result => (Entry.mapDBEntriesEntityToEntries(result)))
  //     .catch(HttpError.wrapAndThrowError);
  // }

  save(input) {
    const entry = { ...input };
    const now = new Date();
    if (!entry.id) {
      entry.createdDate = entry.createdDate || now;
      entry.lastModified = entry.createdDate;
      return this.db.one(sql.entries.add, { ...entry })
        .then(result => (Entry.mapDBEntriesEntityToEntries(result)))
        .catch(HttpError.wrapAndThrowError);
    }
    entry.lastModified = now;
    return this.findById(entry.id).then((data) => {
      const newEntry = { ...data, ...entry };
      return this.db.one(sql.entries.update, { ...newEntry })
        .then(result => (Entry.mapDBEntriesEntityToEntries(result)))
        .catch(HttpError.wrapAndThrowError);
    });
  }

  findAllByCreator(userId) {
    return this.db.any('SELECT * FROM entries WHERE user_id = $1', +userId)
      .then(result => (Entry.mapDBArrayEntriesToEntries(result)))
      .catch(HttpError.wrapAndThrowError);
  }

  clear() {
    return this.db.none(sql.entries.empty)
      .catch(HttpError.wrapAndThrowError);
  }
}
