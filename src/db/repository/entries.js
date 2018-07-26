import sql from '../sql';
import Entry from '../../models/Entry';

export default class EntryRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1', +id)
      .then(Entry.mapDBEntriesEntityToEntries);
  }

  findByIdAndByOwner(id, creatorID) {
    return this.db.oneOrNone('SELECT * FROM entries WHERE id = $1 AND owner_id = $2', [+id, +creatorID])
      .then(Entry.mapDBEntriesEntityToEntries);
  }

  save(input) {
    const entry = { ...input };
    const now = new Date();
    if (!entry.id) {
      entry.createdDate = now;
      entry.lastModified = now;
      console.log('save new entry => ', entry);
      return this.db.one(sql.entries.add, { ...entry })
        .then(Entry.mapDBEntriesEntityToEntries);
    }
    entry.lastModified = now;
    return this.findById(entry.id).then((data) => {
      if (data) {
        const newEntry = { ...data, ...entry };
        console.log('update new entry => ', newEntry);
        return this.db.one(sql.entries.update, { ...newEntry })
          .then(Entry.mapDBEntriesEntityToEntries);
      }
      return Promise.reject(Error(`Invalid id ${entry.id}`));
    });
  }

  findAllByCreator(userId) {
    return this.db.any('SELECT * FROM entries WHERE owner_id = $1', +userId)
      .then(Entry.mapDBArrayEntriesToEntries);
  }

  clear() {
    return this.db.none(sql.entries.empty);
  }
}
