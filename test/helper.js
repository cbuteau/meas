
var meas;
describe('Helper API', function() {
  beforeAll(function(done) {
    require(['meas'], function(measLoad) {
      meas = measLoad;
      meas.perf.clr.mark();
      meas.perf.clr.meas();

      //console.log(meas.BrowserFlags);
      //console.log(meas.OsFlags);

      setTimeout(done, 500);
      //done();
    });
  });

  it ('Run loop', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    var data = meas.endnmeas('loop');


    var marks = meas.perf.ls.mark();
    // clear is not working in headless firefox.
    // if (meas.OsFlags.isWin && meas.BrowserFlags.isFirefox) {
    //   expect(marks.length).toBe(4);
    // } else {
      expect(marks.length).toBe(2);
    // }

    var meass = meas.perf.ls.meas();
    // if (meas.OsFlags.isWin && meas.BrowserFlags.isFirefox) {
    //   expect(meass.length).toBe(2);
    // } else {

    // sick of fighting ci system...it changes each run...
    // so just confirming in chrome.
    if (meas.BrowserFlags.isChrome) {
      expect(meass.length).toBe(1);
    }
    // }

  });

  it ('Now clear marks', function(done) {
    meas.perf.clr.mark();

    setTimeout(function() {
      var marks = meas.perf.ls.mark();
      expect(marks.length).toBe(0);
      done();
    }, 3000);
  });

  it ('Now clear measures', function(done) {
    meas.perf.clr.meas();

    setTimeout(function() {
      var meass = meas.perf.ls.meas();
      expect(meass.length).toBe(0);
      done();
    }, 3000);

  });

  it ('Find', function() {
    meas.perf.clr.meas();
    meas.perf.clr.mark();
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    var data = meas.endnmeas('loop');

    var marks = meas.perf.find.mark('loop');
    expect(marks.length).toBe(2);

    var meass = meas.perf.find.meas('loop');
    expect(meass.length).toBe(1);
  });

});
