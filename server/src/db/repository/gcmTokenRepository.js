import sql from '../sql';
import BaseRepository from './baseRepository';
import { mapAndWrapDbPromise } from '../../utils';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */
export default class GcmTokenRepository extends BaseRepository {
  constructor(db) {
    super(db, sql.gcmToken);
  }

  findById(id) {
    return super.findById({ id }, GcmTokenRepository.map);
  }

  findByUserId(userId) {
    return mapAndWrapDbPromise(this.db.oneOrNone('SELECT * FROM gcm_token WHERE user_id = $1', userId),
      GcmTokenRepository.map);
  }

  save(input) {
    return super.save(input, GcmTokenRepository.map);
  }

  static map(entity) {
    let gcmToken = null;
    if (entity) {
      gcmToken = {};
      gcmToken.id = entity.id;
      gcmToken.userId = entity.user_id;
      gcmToken.gcmToken = entity.token;
    }

    return gcmToken;
  }
}
