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

  static mapDBArrayEntriesToEntries(array) {
    const entries = [];
    array.forEach((item) => {
      entries.push(Entry.mapDBEntriesEntityToEntries(item));
    });
    return entries;
  }
}
