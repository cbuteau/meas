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

};

```
