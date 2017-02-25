/**
 * Expose `Emitter`.
 */

//module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
    if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
    for (var key in Emitter.prototype) {
        obj[key] = Emitter.prototype[key];
    }
    return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
    Emitter.prototype.addEventListener = function (event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks[event] = this._callbacks[event] || [])
            .push(fn);
        return this;
    };

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function (event, fn) {
    var self = this;
    this._callbacks = this._callbacks || {};

    function on(a, b, c, d, e, f, g, h) {
        self.off(event, on);
        fn.call(this, a, b, c, d, e, f, g, h);
    }

    on.fn = fn;
    this.on(event, on);
    return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
    Emitter.prototype.removeListener =
        Emitter.prototype.removeAllListeners =
            Emitter.prototype.removeEventListener = function (event, fn) {
                this._callbacks = this._callbacks || {};

                // all
                if (0 == arguments.length) {
                    this._callbacks = {};
                    return this;
                }

                // specific event
                var callbacks = this._callbacks[event];
                if (!callbacks) return this;

                // remove all handlers
                if (1 == arguments.length) {
                    delete this._callbacks[event];
                    return this;
                }

                // remove specific handler
                var cb;
                for (var i = 0; i < callbacks.length; i++) {
                    cb = callbacks[i];
                    if (cb === fn || cb.fn === fn) {
                        callbacks.splice(i, 1);
                        break;
                    }
                }
                return this;
            };

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function (event, a, b, c, d, e, f, g, h) {
    this._callbacks = this._callbacks || {};
    var callbacks = this._callbacks[event];

    if (callbacks) {
      var len = callbacks.length;
      if (len > 5) {
        callbacks = callbacks.slice(0);
        for (var i = 0; i < len; ++i) {
          callbacks[i].call(this, a, b, c, d, e, f, g, h);
        }
      } else if (len == 1) {
        callbacks[0].call(this, a, b, c, d, e, f, g, h);
      } else {
        var f0 = callbacks[0];
        var f1 = callbacks[1];
        var f2 = callbacks[2];
        var f3 = callbacks[3];
        var f4 = callbacks[4];
        if (f0) {
          f0.call(this, a, b, c, d, e, f, g, h);
          if (f1) {
            f1.call(this, a, b, c, d, e, f, g, h);
            if (f2) {
              f2.call(this, a, b, c, d, e, f, g, h);
              if (f3) {
                f3.call(this, a, b, c, d, e, f, g, h);
                if (f4) {
                  f4.call(this, a, b, c, d, e, f, g, h);
                }
              }
            }
          }
        }
      }
    }

    return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function (event) {
    this._callbacks = this._callbacks || {};
    return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function (event) {
    return !!this.listeners(event).length;
};
