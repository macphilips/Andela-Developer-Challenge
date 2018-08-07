import sql from '../sql';
import Entry from '../../models/entry';
import HttpError from '../../utils/httpError';
import { mapAndWrapDbPromise } from '../../utils/util';

export default class EntryRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM entries WHERE id = $1', +id),
      Entry.mapDBEntriesEntityToEntries);
  }

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
      return mapAndWrapDbPromise(this.db.one(sql.entries.update, { ...newEntry }),
        Entry.mapDBEntriesEntityToEntries);
    });
  }

  findAllByCreator(userId) {
    return mapAndWrapDbPromise(this.db.any('SELECT * FROM entries WHERE user_id = $1', +userId),
      Entry.mapDBArrayEntriesToEntries);
  }

  remove(id) {
    return this.db.result('DELETE FROM entries WHERE id = $1',
      +id, r => r.rowCount)
      .catch(HttpError.wrapAndThrowError);
  }

  clear() {
    return this.db.none(sql.entries.empty)
      .catch(HttpError.wrapAndThrowError);
  }
}
