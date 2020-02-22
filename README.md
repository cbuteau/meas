# meas

A wrapper around the performance API.


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
