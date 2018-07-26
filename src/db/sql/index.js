import { QueryFile } from 'pg-promise';
import path from 'path';

// /////////////////////////////////////////////
// Helper for linking to external query files;
function sql(file) {
  const fullPath = path.join(__dirname, file); // generating full path;

  const options = {
    minify: true,
    params: {
      schema: 'public', // replace ${schema~} with "public"
    },
  };

  const qf = new QueryFile(fullPath, options);

  if (qf.error) {
    console.error(qf.error);
  }

  return qf;
}

export default {
  myDiary: sql('../../../../scripts/my_diary.sql'),
  users: {
    add: sql('../../../../scripts/users/add.sql'),
    create: sql('../../../../scripts/users/create.sql'),
    empty: sql('../../../../scripts/users/empty.sql'),
  },
  entries: {
    add: sql('../../../../scripts/entries/add.sql'),
    create: sql('../../../../scripts/entries/create.sql'),
    constraints: sql('../../../../scripts/entries/constraints.sql'),
    find: sql('../../../../scripts/entries/find.sql'),
    empty: sql('../../../../scripts/entries/empty.sql'),
    update: sql('../../../../scripts/entries/update.sql'),
  },
  reminder: {
    add: sql('../../../../scripts/reminder/add.sql'),
    create: sql('../../../../scripts/reminder/create.sql'),
    empty: sql('../../../../scripts/reminder/empty.sql'),
  },
};
