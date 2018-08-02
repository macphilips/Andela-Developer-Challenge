import Event from './event';

export default class RowItemModel {
  constructor(obj) {
    this.valueChangeObserver = new Event(null);
    Object.keys(obj).forEach((key) => {
      let value;
      Object.defineProperty(this, key, {
        set(newValue) {
          value = newValue;
          this.valueChangeObserver.notify();
        },
        get() {
          return value;
        },
        enumerable: true,
      });
    });
    Object.keys(obj).forEach((key) => {
      this[key] = obj[key];
    });
  }
}

/*
export default class RowItemModel {
  get id() {
    return this.pId;
  }

  set id(value) {
    this.valueChangeObserver.notify();
    this.pId = value;
  }

  get title() {
    return this.pTitle;
  }

  set title(value) {
    this.valueChangeObserver.notify();
    this.pTitle = value;
  }

  get content() {
    return this.pContent;
  }

  set content(value) {
    this.valueChangeObserver.notify();
    this.pContent = value;
  }

  get createdDate() {
    return this.pCreatedDate;
  }

  set createdDate(value) {
    this.valueChangeObserver.notify();
    this.pCreatedDate = value;
  }

  get lastModified() {
    return this.pLastModified;
  }

  set lastModified(value) {
    this.valueChangeObserver.notify();
    this.pLastModified = value;
  }

  constructor(obj) {
    console.log('object => ', obj);
    this.pId = obj.id;
    this.pTitle = obj.title;
    this.pContent = obj.content;
    this.pCreatedDate = obj.createdDate;
    this.pLastModified = obj.lastModified;
    this.valueChangeObserver = new Event(null);
  }
} */
