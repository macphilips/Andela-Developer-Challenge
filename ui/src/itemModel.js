import Event from './event';

export default function RowItemModel(obj) {
  const self = this;
  this.valueChangeObserver = new Event(null);
  Object.keys(obj).forEach((key) => {
    let value;
    Object.defineProperty(self, key, {
      set(newValue) {
        value = newValue;
        self.valueChangeObserver.notify();
      },
      get() {
        return value;
      },
      enumerable: true,
    });
  });
  Object.keys(obj).forEach((key) => {
    self[key] = obj[key];
  });
}

RowItemModel.prototype = {
  bindPropToView(prop, view) {
  },
};
