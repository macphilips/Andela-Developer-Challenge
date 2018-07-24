export default class Entry {
  constructor(id, title, content, created, LastModified) {
    this.creatorID = '';
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdDate = created;
    this.lastModified = LastModified;
  }
}
