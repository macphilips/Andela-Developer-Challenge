import { mapAndWrapDbPromise } from '../../utils';
import HttpError from '../../utils/httpError';

export default class BaseRepository {
  constructor(db, sql) {
    this.db = db;
    this.sql = sql;
  }

  findById(params, mapper) {
    return mapAndWrapDbPromise(this.db.oneOrNone(this.sql.find, params), mapper);
  }

  save(inputEntity, mapper) {
    const entity = { ...inputEntity };
    const now = new Date();
    if (!entity.id) {
      entity.createdDate = entity.createdDate || now;
      entity.lastModified = entity.createdDate;
      return mapAndWrapDbPromise(this.db.one(this.sql.add, { ...entity }),
        mapper);
    }
    entity.lastModified = now;
    return this.findById(entity.id).then((data) => {
      const newEntity = { ...data, ...entity };
      return mapAndWrapDbPromise(this.db.one(this.sql.update, { ...newEntity }),
        mapper);
    });
  }

  remove(id) {
    return this.db.result(this.sql.delete,
      { id }, r => r.rowCount)
      .catch(HttpError.wrapAndThrowError);
  }

  clear() {
    return this.db.none(this.sql.empty)
      .catch(HttpError.wrapAndThrowError);
  }
}
