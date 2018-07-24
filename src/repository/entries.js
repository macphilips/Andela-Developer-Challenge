import has from 'has';
import randomString from 'randomstring';

class EntryRepository {
  constructor() {
    this.entries = {};
  }

  findById(userId) {
    return (has(this.entries, userId)) ? this.entries[userId] : false;
  }

  save(input) {
    const entry = { ...input };
    const now = new Date();
    if (!entry.id) {
      entry.id = randomString.generate(8);
      entry.createdDate = now;
    }
    entry.lastModified = now;
    const oldVar = this.entries[entry.id];
    this.entries[entry.id] = { ...oldVar, ...entry };

    return this.entries[entry.id];
  }

  findAllByCreator(userId) {
    const entries = [];
    Object.keys(this.entries).forEach(((key) => {
      const entry = this.entries[key];
      if (entry.creatorID === userId) {
        entries.push(entry);
      }
    }));

    return entries;
  }

  clear() {
    this.entries = {};
  }
}

const entries = new EntryRepository();
export default entries;
