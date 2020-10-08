# meas

A wrapper around the performance API.

# Badges

### Coveralls

[![Coverage Status](https://coveralls.io/repos/github/cbuteau/meas/badge.svg?branch=master)](https://coveralls.io/github/cbuteau/meas?branch=master)

### Circle CI Build

[![CircleCI](https://circleci.com/gh/cbuteau/meas.svg?style=svg)](https://circleci.com/gh/cbuteau/meas)

### npm Version

[![npm version](http://img.shields.io/npm/v/meas.svg?style=flat)](https://npmjs.org/package/meas "View this project on npm")


### npm big badge

[![NPM](https://nodei.co/npm/meas.png)](https://nodei.co/npm/meas/)

## Concept

This is the result of me making a couple of these wrappers at work.
I wanted to take lessons learned and simplify it for other peoples usage.

## API

```javascript
{
  // to set the perfPtr to another source some teams prefer window.top.performance.
  setPerfPtr: function(object) {},

  // start a measure with a mark.
  start: function(name) {},

  // end a measure with just a mark.
  end: function(name) {},

  // end and calculate the measure and return the entry (for testing)
  endnmeas: function(name) {},

  // get measure later.
  meas: function(name) {},

  // enable or diable...makes other methods pass throughs.
  enable: function(enabled) {},

  // for sectioning off the code into different trackers.
  addOrGetSection: function(name) {},

  // utilities to make it simpler to see the existing marks and measures.
  perf: {
    ls: {
      meas: function () {},
      mark: function() {}
    },
    clr: {
      meas: function () {},
      mark: function() {}
    }
    find: {
      meas: function () {},
      mark: function() {}
    }
  },

  // duck typing flags for browser determination..for testing.
  BrowserFlags: {
    isOpera: isOpera,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isIE: isIE,
    isEdge: isEdge,
    isChrome: isChrome,
    isBlink: isBlink  
  }

  // userAgent sniffing to determine OS for specifying between
  // build system and desktop with expects.
  OsFlags: {
    isWin: isWin,
    isMac: isMac,
    isUnix: isUnix,
    isLinux: isLinux    
  }
};

```

## Globals

The intention of this library was always to install a global so in the console you could type meas.<apicall>()

Upon deploying in a work enviromnet that used frames I found that I not only had to set window.<globalname> but window.top.<globalname> so it was ALWAYS available in the console.


## Sections

Upond revisting this I found it was too flat and I kept making the tracker ids longer and long to distinguish them in analysisc.

For sections the start() end() methods exist and a dump() method.

### Usage

```javascript
var section = meas.addOrGetSection('app').addOrGetSection('algorithms');

// If this code gets executed multiple times you want to collect ALL the measurements an perform avergae calculations on them.
// this is done by passing options = { stats: true }
section.start('loop', { stats: true });
var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
for ( var i = 0; i < array.length; i++) {
  console.log(array[i]);
}
section.end('loop');

```
