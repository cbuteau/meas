
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

// https://stackoverflow.com/questions/11219582/how-to-detect-my-browser-version-and-operating-system-using-javascript

var isWin = (navigator.appVersion.indexOf("Win")!=-1);
var isMac = (navigator.appVersion.indexOf("Mac")!=-1);
var isLinux = (navigator.appVersion.indexOf("Linux")!=-1);
var isUnix = (navigator.appVersion.indexOf("X11")!=-1);

var OsFlags = {
  isWin: isWin,
  isMac: isMac,
  isUnix: isUnix,
  isLinux: isLinux
};

Object.freeze(OsFlags);

var MEAS_TYPE = 'measure';
var MARK_TYPE = 'mark';

function TrackerProxy(section, name, options) {
  this.name = name;
  this.section = section;
  this.section.start(name, options);
}

TrackerProxy.prototype = {
  end: function() {
    this.section.end(this.name);
  }
};

function Tracker(perPtr, name, options) {
  this._perfPtr = perPtr;
  this.name = name;
  this.startName = name + '_start';
  this.endName = name + '_end';
  this.measName = name + '_meas';
  if (options) {
    this.options = options;
  }
  this.hasMeasured = false;
  this._perfPtr.mark(this.startName);
}

Tracker.prototype = {
  end: function() {
    if (this.hasEnded) {
      return;
    }
    this._perfPtr.mark(this.endName);
    this.hasEnded = true;
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
  },
  dump: function(prefix) {
    var measures = this._perfPtr.getEntriesByType(MEAS_TYPE);
    var that = this;
    var filtered = measures.filter(function(m) {
      return m.name === that.measName;
    });
    var prefixPath = prefix || '';
    if (this.options && this.options.stats) {
      var sum = 0;
      var min = Number.MAX_SAFE_INTEGER;
      var max = Number.MIN_SAFE_INTEGER;
      var len = filtered.length;
      for (var i = 0; i < len; i++) {
        var cur = filtered[i];
        var dur = cur.duration;
        sum += dur;
        if (dur < min) {
          min = dur;
        }
        if (dur > max) {
          max = dur;
        }
      }
      var avg = sum / len;

      var variance = 0;
      for (var j = 0; j < len; j++) {
        var varcalc = filtered[j];
        variance += (varcalc.duration - avg) ^ 2;
      }
      variance /= len;

      var stddev = Math.sqrt(variance);

      this.calculated = {
        cnt: len,
        min: min,
        max: max,
        avg: avg,
        var: variance,
        stddev: stddev
      };

      var formatted = 'name=' + this.name + ', cnt=' + len + ' avg=' + avg + ', min=' + min + ', max=' + max + ', σ2=' + variance + ', σ=' + stddev;
      console.log(formatted);
    } else {
      var len2 = filtered.length;
      if (len2 > 1) {
        console.warn('there are more than one entry...maybe you should do stats');
      }
      var current = filtered[len2 - 1];

      if (len2) {
        this.calculated = {
          duration: current.duration
        };

        var formatted2 = 'name=' + this.name + ', value=' + current.duration;
        console.log(formatted2);
      }
    }
  }
};

function TrackerSection(perfPtr, name, trackerPrefix) {
  this.perfPtr = perfPtr;
  this.name = name;
  this.trackerPrefix = trackerPrefix;
  this.enabled = true;
  this.trackers = {};
  this.sections = {};
}

TrackerSection.prototype = {
  create: function(trackerName, options) {
    return new TrackerProxy(this, trackerName, options);
  },
  start: function(trackerName, options) {
    if (!this.enabled) {
      return;
    }

    var prefixedName = this.trackerPrefix + '.' + trackerName;

    if (this.trackers[trackerName]) {
      // at least end the current before replacing.
      this.trackers[trackerName].end();
    }

    this.trackers[trackerName] = new Tracker(this.perfPtr, prefixedName, options);
  },

  end: function(trackerName) {
    if (!this.enabled) {
      return;
    }

    if (this.trackers[trackerName]) {
      this.trackers[trackerName].end();
    }
  },

  enable: function(enabled) {
    this.enabled = enabled;

    var sectionKeys = Object.keys(this.sections);
    for (var j = 0; j < sectionKeys.length; j++) {
      var sectionId = sectionKeys[j];
      this.sections[sectionId].enable(enabled);
    }
  },

  addOrGetSection: function(name) {
    if (!this.enabled) {
      return;
    }
    var check = this.sections[name];
    if (check) {
      return check;
    } else {
      var trackerPrefix = this.trackerPrefix + '.' + this.name;
      check = this.sections[name] = new TrackerSection(this.perfPtr, name, trackerPrefix);
    }

    return check;
  },

  dump: function(prefix) {
    var prefixPath = prefix || '';
    if (prefixPath.length) {
      prefixPath += '.' + this.name;
    } else {
      prefixPath = this.name;
    }

    var trackerKeys = Object.keys(this.trackers);
    for (var i = 0; i < trackerKeys.length; i++) {
      var trackerId = trackerKeys[i];
      var tracker = this.trackers[trackerId];
      tracker.meas();
      this.trackers[trackerId].dump(prefixPath);
    }

    var sectionKeys = Object.keys(this.sections);
    for (var j = 0; j < sectionKeys.length; j++) {
      var sectionId = sectionKeys[j];
      this.sections[sectionId].dump(prefixPath);
    }
  }
};

// <editor-fold> Helpers

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
      if (current.name.indexOf(context) !== -1) {
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
      if (current.name.indexOf(context) !== -1) {
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

// </editor-fold> Helpers

function TrackerManager() {
  this.trackers = {};
  this.sections = {};
  this.perfHelper = new PerfHelper(this.perfPtr);
  this.setPerfPtr(window.performance);
  this.enabled = true;
}

TrackerManager.prototype = {
  setPerfPtr: function(object) {
    if (object.mark && object.measure && object.getEntriesByType) {
      this._perfPtr = object;
      this.perfHelper._set(object);
      if (object.onresourcetimingbufferfull) {
        object.onresourcetimingbufferfull  = function() {
          console.error('You cannot make more marks and measures try upping your buffersize');
        };
      }
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

  addOrGetSection: function(name) {
    if (!this.enabled) {
      return;
    }
    var check = this.sections[name];
    if (check) {
      return check;
    } else {
      check = this.sections[name] = new TrackerSection(this.perfPtr, name, name);
    }

    return check;
  },

  buildOrGetSection: function(sectionPath) {
    var parts = sectionPath.split('.');

    var section;
    for (var i = 0; i < parts.length; i++) {
      var currentSection = parts[i];
      if (i === 0) {
        section = this.addOrGetSection(currentSection);
      } else {
        section = section.addOrGetSection(currentSection);
      }
    }

    return section;
  },

  enable: function(enabled) {
    this.enabled = enabled;

    var sectionKeys = Object.keys(this.sections);
    for (var j = 0; j < sectionKeys.length; j++) {
      var sectionId = sectionKeys[j];
      this.sections[sectionId].enable(enabled);
    }
  },

  dump: function() {
    var sectionKeys = Object.keys(this.sections);
    for (var j = 0; j < sectionKeys.length; j++) {
      var sectionId = sectionKeys[j];
      this.sections[sectionId].dump();
    }
  }
};

Object.defineProperties(TrackerManager.prototype, {
  BrowserFlags: {
    value: BrowserFlags,
    writable: false,
  },
  OsFlags: {
    value: OsFlags,
    writable: false
  },
  perf: {
    get: function() {
      return this.perfHelper;
    }
  },
  perfPtr: {
    get: function() {
      return this._perfPtr;
    }
  },
  buffersize: {
    set: function(value) {
      if (this._perfPtr.setResourceTimingBufferSize) {
        this._perfPtr.setResourceTimingBufferSize(value);
      }
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
  // global to both the possible frame and the console.
  window.meas = meas;
  window.top.meas = meas;
}

// API does not work in nodejs...so only support
// requirejs and global.
if (typeof define === 'function' && define.amd) {
  define(function() {
    return meas;
  });
  // also make global to use from the console.
  //window.meas = meas;
// } else if (typeof exports === 'object') {
//   module.exports = exposed;
} else {
  //window.meas = meas;
}
