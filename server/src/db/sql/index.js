import { QueryFile } from 'pg-promise';
import path from 'path';

/**
 * This implementation is based on examples from pg-promise repo:
 * https://github.com/vitaly-t/pg-promise-demo/tree/master/JavaScript
 *
 */

function sql(file) {
  const fullPath = path.join(__dirname, file); // generating full path;

  const options = {
    minify: true,
    params: {
      schema: 'public', // replace ${schema~} with "public"
    },
  };

  const queryFile = new QueryFile(fullPath, options);

  if (queryFile.error) {
    console.error(queryFile.error);
  }

  return queryFile;
}

const root = (process.env.NODE_ENV === 'test') ? '../../../' : '../../../../';

function getBasicQuery(dir) {
  const folder = `${root}scripts/${dir}/`;
  return {
    add: sql(`${folder}add.sql`),
    // create: sql(`${folder}create.sql`),
    delete: sql(`${folder}delete.sql`),
    empty: sql(`${folder}empty.sql`),
    find: sql(`${folder}find.sql`),
    update: sql(`${folder}update.sql`),
  };
}

const users = getBasicQuery('users');
const entries = getBasicQuery('entries');
const reminder = getBasicQuery('reminder');
const gcmToken = getBasicQuery('gcm');

export default {
  gcmToken,
  myDiary: sql(`${root}scripts/my_diary.sql`),
  functions: sql(`${root}scripts/functions.sql`),

  reminder: {
    ...reminder,
    findAllWithinTime: sql(`${root}scripts/reminder/findAllWithinTime.sql`),
  },
  entries: {
    ...entries,
    entriesByUserPageable: sql(`${root}scripts/entries/entriesByUserPageable.sql`),
  },
  users: {
    ...users,
    findUser: sql(`${root}scripts/users/findUser.sql`),
    findUserWithEntriesCount: sql(`${root}scripts/users/findUserWithEntriesCount.sql`),
  },
};
