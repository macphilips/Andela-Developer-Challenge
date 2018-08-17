import { mapArray } from '../utils';

export default class Entry {
  constructor(id, title, content, created, LastModified) {
    this.userID = '';
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdDate = created;
    this.lastModified = LastModified;
  }

  static mapDBEntityToEntry(entity) {
    return Promise.resolve(Entry.map(entity));
  }

  static mapDBArrayEntriesToEntries(array, pageInfo) {
    let totalEntries = 0;
    let { page } = pageInfo;
    const { size } = pageInfo;
    const [entry] = array;
    if (entry) {
      totalEntries = entry.num_entries;
      const totalPages = Math.ceil(totalEntries / size);
      if (page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }
    }

    return mapArray(array, Entry.map).then((entries) => {
      const result = {
        entries,
        page,
        totalEntries,
      };
      return Promise.resolve(result);
    });
  }

  static map(entity) {
    if (!entity) return null;
    const entry = new Entry();
    entry.id = entity.id;
    entry.title = entity.title;
    entry.content = entity.content;
    entry.userID = entity.user_id;
    entry.createdDate = entity.created_date;
    entry.lastModified = entity.last_modified_date;

    return entry;
  }
}
