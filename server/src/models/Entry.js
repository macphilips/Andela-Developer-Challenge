export default class Entry {
  constructor(id, title, content, created, LastModified) {
    this.userID = '';
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdDate = created;
    this.lastModified = LastModified;
  }

  static mapDBEntriesEntityToEntries(entity) {
    const mapped = Entry.map(entity);
    return Promise.resolve(mapped);
  }

  static mapDBArrayEntriesToEntries(array) {
    const entries = [];
    array.forEach((item) => {
      entries.push(Entry.map(item));
    });
    return Promise.resolve(entries);
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
