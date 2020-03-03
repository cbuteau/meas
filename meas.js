
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

var MEAS_TYPE = 'measure';
var MARK_TYPE = 'mark';

function Tracker(perPtr, name) {
  this._perfPtr = perPtr;
  this.startName = name + '_start';
  this.endName = name + '_end';
  this.measName = name + '_meas';
  this.hasMeasured = false;
  this._perfPtr.mark(this.startName);
}

Tracker.prototype = {
  end: function() {
    this._perfPtr.mark(this.endName);
  },
  endnmeas: function(name) {
    this.end();
    return this.meas();
  },
  meas: function() {
    if (!this.hasMeasured) {
      this._perfPtr.measure(this.measName, this.startName, this.endName);
      this.hasMeasured = true;
    }
    return this._findmeas();
  },
  _findmeas: function() {
    var measures = this._perfPtr.getEntriesByType(MEAS_TYPE);
    for (var i = 0; i < measures.length; i++) {
      var current = measures[i];
      if (current.name === this.measName) {
        return current;
      }
    }
  }
};

function ClearHelper(perfPtr) {
  this.perfPtr = perfPtr;
}

ClearHelper.prototype = {
  _set: function(perfPtr) {
    this.perfPtr = perfPtr;
  },
  mark: function() {
    this.perfPtr.clearMarks();
  },
  meas: function() {
    this.perfPtr.clearMeasures();
  }
};

function LsHelper(perfPtr) {
  this.perfPtr = perfPtr;
}

LsHelper.prototype = {
  _set: function(perfPtr) {
    this.perfPtr = perfPtr;
  },
  mark: function() {
    var marks = this.perfPtr.getEntriesByType(MARK_TYPE);
    var result = [];
    for (var i = 0; i < marks.length ; i++) {
      result.push(marks[i].name);
    }
    return result;
  },
  meas: function() {
    var marks = this.perfPtr.getEntriesByType(MEAS_TYPE);
    var result = [];
    for (var i = 0; i < marks.length ; i++) {
      result.push(marks[i].name);
    }
    return result;
  }
};

function FindHelper(perfPtr) {
  this.perfPtr = perfPtr;
}

FindHelper.prototype = {
  _set: function(perfPtr) {
    this.perfPtr = perfPtr;
  },
  mark: function(context) {
    var marks = this.perfPtr.getEntriesByType(MARK_TYPE);
    var result = [];
    for (var i = 0; i < marks.length ; i++) {
      var current = marks[i];
      if (current.name.indexOf(context) !== 0) {
        result.push(current);
      }
    }
    return result;
  },
  meas: function(context) {
    var meas = this.perfPtr.getEntriesByType(MEAS_TYPE);
    var result = [];
    for (var i = 0; i < meas.length ; i++) {
      var current = meas[i];
      if (current.name.indexOf(context) !== 0) {
        result.push(current);
      }
    }
    return result;
  }
};

function PerfHelper(perfPtr) {
  this.perfPtr = perfPtr;
  this.clearHelper = new ClearHelper(this.perfPtr);
  this.lsHelper = new LsHelper(this.perfPtr);
  this.findHelper = new FindHelper(this.perfPtr);
}

PerfHelper.prototype = {
  _set: function(perfPtr) {
    this._perfPtr = perfPtr;
    this.clearHelper._set(perfPtr);
    this.lsHelper._set(perfPtr);
    this.findHelper._set(perfPtr);
  }
};

Object.defineProperties(PerfHelper.prototype, {
  clr: {
    get: function() {
      return this.clearHelper;
    }
  },
  ls: {
    get: function() {
      return this.lsHelper;
    }
  },
  find: {
    get: function() {
      return this.findHelper;
    }
  }
});


function TrackerManager() {
  this.trackers = {};
  this.perfPtr = window.performance;
  this.perfHelper = new PerfHelper(this.perfPtr);
  this.enabled = true;
}

TrackerManager.prototype = {
  setPerfPtr: function(object) {
    if (object.mark && object.measure && object.getEntriesByType) {
      this.perfPtr = object;
      this.perfHelper._set(object);
    }
  },
  start: function(name) {
    if (!this.enabled) {
      return;
    }
    this.trackers[name] = new Tracker(this.perfPtr, name);
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
  meas: function(name) {
    if (!this.enabled) {
      return;
    }

    if (this.trackers[name]) {
      return this.trackers[name].meas();
    }
  },
  specificMeas: function(name, startMarkName, endMarkName) {
    this.perfPtr.measure(name, startMarkName, endMarkName);
    var meass = this.perfPtr.getEntriesByType('measure');
    return meass.filter(function(m) {
      return m.name === name;
    });
  },
  withMeas: function(name, callback) {
    try {
      this.start(name);
      callback();
    } finally {
      this.end(name);
    }
  },
  enable: function(enabled) {
    this.enabled = enabled;
  }
};

Object.defineProperties(TrackerManager.prototype, {
  BrowserFlags: {
    value: BrowserFlags,
    writable: false,
  },
  perf: {
    get: function() {
      return this.perfHelper;
    }
  }
});

// Object.defineProperty(TrackerManager.prototype, 'BrowserFlags', {
//   value: BrowserFlags,
//   writeable: false
// });

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
// } else if (typeof exports === 'object') {
//   module.exports = exposed;
} else {
  window.meas = meas;
}
