var meas;
describe('Exercise API', function() {
  beforeAll(function(done) {
    require(['meas'], function(measLoad) {
      meas = measLoad;
      meas.enable(true);
      done();
    });
  });

  it ('Run loop', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');
    var data = meas.getmeas('loop');

    if (meas.BrowserFlags.isChrome) {
      expect(data.duration).toBeLessThan(4.0);

    } else if (meas.BrowserFlags.isFirefox) {
      expect(data.duration).toBeLessThan(5.1);

    }

  });
});
