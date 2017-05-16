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
    var listeners = this.listeners[type];
    var args = Array.prototype.slice.call(arguments);
    args.shift();
    if (typeof window.console !== "undefined") {
      window.console.info("on\t" + type + "\t" + args.join(" , "));
    }
    if (listeners) {
      for (var i = 0, len = listeners.length; i < len; i++) {
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