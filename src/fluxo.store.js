Fluxo.Store = function(data, options) {
  // Copy data to not mutate the original object
  if (data) {
    data = JSON.parse(JSON.stringify(data));
  }

  this.data = data || {};
  this.options = options || {};
  this.changeEventToken = Math.random().toString().slice(2, 11);

  Fluxo.Mixin.apply(null, [Object.getPrototypeOf(this)].concat(this.mixins));

  this.initialize(data, options);
};

Fluxo.Store.extend = extend;

Fluxo.Store.prototype = {
  initialize: function () {},

  mixins: [],

  toJSON: function() {
    return this.data;
  },

  setAttribute: function(attribute, value, options) {
    options = options || {};

    var isEqual = (this.data[attribute] === value);

    this.data[attribute] = value;

    if (isEqual) { return; }

    this.trigger("change:" + attribute);

    if (options.silentGlobalChange) { return; }

    this.trigger("change");
  },

  set: function(data) {
    for (var key in data) {
      this.setAttribute(key, data[key], { silentGlobalChange: true });
    }

    this.trigger("change");
  },

  on: function(events, callback) {
    var cancelers = [];

    for (var i = 0, l = events.length; i < l; i ++) {
      var eventName = events[i],
          changeEventToken = (this.changeEventToken + ":" + eventName),
          canceler = Fluxo.Radio.subscribe(changeEventToken, callback.bind(this));

      cancelers.push(canceler);
    }

    var aggregatedCanceler = function() {
      for (var i = 0, l = cancelers.length; i < l; i ++) {
        var canceler = cancelers[i];
        canceler.call();
      }
    };

    return aggregatedCanceler;
  },

  trigger: function(eventName) {
    Fluxo.Radio.publish(this.changeEventToken + ":" + eventName);
  }
};