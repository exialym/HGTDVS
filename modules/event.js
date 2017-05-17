/**
 * Created by exialym on 2017/5/16 0016.
 */
function EventDispatcher() {
  this.listeners = {};
}

EventDispatcher.prototype = {
  on: function(type, listener) {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  },
  emit: function(type) {
    let listeners = this.listeners[type];
    let args = Array.prototype.slice.call(arguments);
    args.shift();
    if (listeners) {
      for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i].apply(this, args);
      }
    }
  },
  off: function(type) {
    delete this.listeners[type];
  }
};
let eventDispatcher = new EventDispatcher();
export default eventDispatcher;