
// https://gist.github.com/golman/063e3788447bd878e4fa5e9327617041

// Browser flags by duck typing.

// Opera 8.0+
var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

// Safari 3.0+ "[object HTMLElementConstructor]"
var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

// Internet Explorer 6-11
var isIE = /*@cc_on!@*/false || !!document.documentMode;

// Edge 20+
var isEdge = !isIE && !!window.StyleMedia;

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;

// Blink engine detection
var isBlink = (isChrome || isOpera) && !!window.CSS;

var BrowserFlags = {
  isOpera: isOpera,
  isFirefox: isFirefox,
  isSafari: isSafari,
  isIE: isIE,
  isEdge: isEdge,
  isChrome: isChrome,
  isBlink: isBlink
};

Object.freeze(BrowserFlags);

function Tracker(perPtr, name) {
  this._perfPtr = perPtr;
  this.startName = name + '_start';
  this.endName = name + '_end';
  this.measName = name + '_meas';
  this._perfPtr.mark(this.startName);
}

Tracker.prototype = {
  end: function() {
    this._perfPtr.mark(this.endName);
  },
  endnmeas: function(name) {
    this.end();
    this._perfPtr.measure(this.measName, this.startName, this.endName);
    return this.getmeas();
  },
  getmeas: function() {
    var measures = this._perfPtr.getEntriesByType('measure');
    for (var i = 0; i < measures.length; i++) {
      var current = measures[i];
      if (current.name === this.measName) {
        return current;
      }
    }
  }
};


function TrackerManager() {
  this.trackers = {};
  this.perPtr = window.performance;
  this.enabled = true;
}

TrackerManager.prototype = {
  setPerfPtr: function(object) {
    if (object.mark && object.measure && object.getEntryByType) {
      this.perPtr = object;
    }
  },
  start: function(name) {
    if (!this.enabled) {
      return;
    }
    this.trackers[name] = new Tracker(this.perPtr, name);
  },
  end: function(name) {
    if (!this.enabled) {
      return;
    }

    if (this.trackers[name]) {
      this.trackers[name].end();
    }
  },
  endnmeas: function(name) {
    if (!this.enabled) {
      return;
    }

    if (this.trackers[name]) {
      return this.trackers[name].endnmeas();
    }
  },
  getmeas: function(name) {
    if (!this.enabled) {
      return;
    }

    if (this.trackers[name]) {
      return this.trackers[name].getmeas();
    }
  },
  enable: function(enabled) {
    this.enabled = enabled;
  }
};

Object.defineProperty(TrackerManager.prototype, 'BrowserFlags', {
  value: BrowserFlags,
  writeable: false
});

var meas;

if (!meas) {
  meas = new TrackerManager();
}

// API does not work in nodejs...so only support
// requirejs and global.
if (typeof define === 'function' && define.amd) {
  define(function() {
    return meas;
  });
  // also make global to use from the console.
  window.meas = meas;
// } else if (typeof exports === 'object') {
//   module.exports = exposed;
} else {
  window.meas = meas;
}
