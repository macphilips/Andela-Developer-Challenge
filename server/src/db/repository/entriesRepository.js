import sql from '../sql';
import Entry from '../../models/entry';
import { mapAndWrapDbPromise } from '../../utils';
import BaseRepository from './baseRepository';

export default class EntryRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.entries);
  }

  findById(id) {
    return super.findById({ id }, Entry.mapDBEntriesEntityToEntries);
  }

  save(input) {
    return super.save(input, Entry.mapDBEntriesEntityToEntries);
  }

  findAllByCreator(userId) {
    return mapAndWrapDbPromise(this.db.any('SELECT * FROM entries WHERE user_id = $1', +userId),
      Entry.mapDBArrayEntriesToEntries);
  }
}
