//var meas;
describe('Exercise API', function() {
  beforeAll(function(done) {
    // require(['meas'], function(measLoad) {
    //   meas = measLoad;
    //   meas.enable(true);
    //   done();
    // });

    meas.enable(true);
    done();
  });

  it ('Run loop', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');
    var data = meas.meas('loop');

    if (meas.BrowserFlags.isChrome) {
      expect(data.duration).toBeLessThan(4.8);

    } else if (meas.BrowserFlags.isFirefox) {
      expect(data.duration).toBeLessThan(13.1);

    }

  });

  it ('Perform measures later', function(done) {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');

    setTimeout(function() {
      var data = meas.meas('loop');

      if (meas.BrowserFlags.isChrome) {
        expect(data.duration).toBeLessThan(4.0);
      } else if (meas.BrowserFlags.isFirefox) {
        expect(data.duration).toBeLessThan(7.1);
      }
      done();
    }, 1000);


  });


  it ('Perform specific measures', function() {
    meas.perf.clr.meas();

    meas.start('loop1');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop1');

    meas.withMeas('loop2', function() {
      for ( var i = 0; i < array.length; i++) {
        console.log(array[i]);
      }
    });

    var results = meas.specificMeas('both', 'loop1_start', 'loop2_end');
    expect(results.length).toBe(1);

  });



  it ('Set other perf pointer', function(done) {

    // can't just set it...needs to support an interface.
    meas.setPerfPtr({});

    // some teams like to measure off this...
    meas.setPerfPtr(window.top.performance);
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');

    setTimeout(function() {
      var data = meas.meas('loop');

      if (meas.BrowserFlags.isChrome) {
        expect(data.duration).toBeLessThan(4.0);
      } else if (meas.BrowserFlags.isFirefox) {
        expect(data.duration).toBeLessThan(6.1);
      }
      done();
    }, 1000);

  });

});
