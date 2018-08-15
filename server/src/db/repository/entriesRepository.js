import sql from '../sql';
import Entry from '../../models/entry';
import { mapAndWrapDbPromise, MAX_INT } from '../../utils';
import BaseRepository from './baseRepository';

export default class EntryRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.entries);
  }

  findById(id) {
    return super.findById({ id }, Entry.mapDBEntityToEntry);
  }

  save(input) {
    return super.save(input, Entry.mapDBEntityToEntry);
  }

  findAllByCreator(userId, pageable = { page: 0, size: MAX_INT }) {
    return mapAndWrapDbPromise(this.db.any(this.sql.entriesByUserPageable, { ...pageable, userId }),
      Entry.mapDBArrayEntriesToEntries, pageable);
  }
}
