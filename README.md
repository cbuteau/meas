# meas

A wrapper around the performance API.

# Badges

### Coveralls

[![Coverage Status](https://coveralls.io/repos/github/cbuteau/meas/badge.svg)](https://coveralls.io/github/cbuteau/meas)

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
  // start a measure with a mark.
  start: function(name) {},

  // end a measure with just a mark.
  end: function(name) {},

  // end a meausre and calculate the measure and return the entry (for testing)
  endnmeas: function(name) {},

  // get measure later.
  getmeas: function(name) {},

  // enable or diable...makes other methods pass throughs.
  enable: function(enabled) {},

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
