import has from 'has';
import randomString from 'randomstring';

class EntryRepository {
  constructor() {
    this._entries = {};
  }

  findById(userId) {
    return (has(this._entries, userId)) ? this._entries[userId] : false;
  }

  save(input) {
    const entry = { ...input };
    const now = new Date();
    if (!entry.id) {
      entry.id = randomString.generate(8);
      entry.createdDate = now;
    }
    entry.lastModified = now;
    const oldVar = this._entries[entry.id];
    this._entries[entry.id] = { ...oldVar, ...entry };

    return this._entries[entry.id];
  }

  /*
  findAll() {
    const entries = [];
    Object.keys(this._entries).forEach(((value) => {
      entries.push(this._entries[value]);
    }));
    return entries;
  }
  */

  findAllByCreator(userId) {
    const entries = [];
    Object.keys(this._entries).forEach(((key) => {
      const entry = this._entries[key];
      if (entry.creatorID === userId) {
        entries.push(entry);
      }
    }));

    return entries;
  }

  clear() {
    this._entries = {};
  }
}

const entries = new EntryRepository();
export default entries;
