describe('Sections ...', function() {

  const PASSES = 10;

  beforeAll(function() {
    return new Promise(function(resolve, reject) {
      // require(['meas'], function(measLoad) {
      //   meas = measLoad;
      //   //done();
      // });
      resolve();
    });
  });

  it ('Run loop', function() {
    var section = meas.addOrGetSection('test');

    for (var j = 0; j < PASSES; j++) {
      section.start('loop', { stats: true });
      var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
      for ( var i = 0; i < array.length; i++) {
        console.log(array[i]);
      }
      section.end('loop');
    }
    // trigger calcualtions.
    meas.dump();
    var tracker = meas.sections.test.trackers.loop;

    if (meas.BrowserFlags.isChrome) {
      expect(tracker.calculated.avg).toBeLessThan(4.0);

    } else if (meas.BrowserFlags.isFirefox) {
      expect(tracker.calculated.avg).toBeLessThan(5.1);

    }

  });

  it ('buildOrGetSection', function() {
    var section = meas.buildOrGetSection('tests.build');

    for (var j = 0; j < PASSES; j++) {
      section.start('loop', { stats: true });
      var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
      for ( var i = 0; i < array.length; i++) {
        console.log(array[i]);
      }
      section.end('loop');
    }
    // trigger calcualtions.
    meas.dump();
    var tracker = meas.sections.tests.sections.build.trackers.loop;

    if (meas.BrowserFlags.isChrome) {
      expect(tracker.calculated.avg).toBeLessThan(4.0);

    } else if (meas.BrowserFlags.isFirefox) {
      expect(tracker.calculated.avg).toBeLessThan(5.1);

    }

  });
});
