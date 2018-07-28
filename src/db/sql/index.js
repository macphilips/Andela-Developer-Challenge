import { QueryFile } from 'pg-promise';
import path from 'path';
import config from '../../config/config';

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

export default {
  myDiary: sql(`${root}scripts/my_diary.sql`),
  users: {
    add: sql(`${root}scripts/users/add.sql`),
    create: sql(`${root}scripts/users/create.sql`),
    empty: sql(`${root}scripts/users/empty.sql`),
  },
  entries: {
    add: sql(`${root}scripts/entries/add.sql`),
    create: sql(`${root}scripts/entries/create.sql`),
    constraints: sql(`${root}scripts/entries/constraints.sql`),
    find: sql(`${root}scripts/entries/find.sql`),
    empty: sql(`${root}scripts/entries/empty.sql`),
    update: sql(`${root}scripts/entries/update.sql`),
  },
  reminder: {
    add: sql(`${root}scripts/reminder/add.sql`),
    create: sql(`${root}scripts/reminder/create.sql`),
    empty: sql(`${root}scripts/reminder/empty.sql`),
  },
};
