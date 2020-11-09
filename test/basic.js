//var meas;
describe('Exercise API', function() {
  beforeAll(function() {
    return new Promise(function(resolve, reject) {
      // require(['meas'], function(measLoad) {
      //   meas = measLoad;
      //   //done();
      // });
      resolve();
    });
  });

  it ('RUn loop', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    var data = meas.endnmeas('loop');

    if (meas.BrowserFlags.isChrome) {
      expect(data.duration).toBeLessThan(4.0);

    } else if (meas.BrowserFlags.isFirefox) {
      expect(data.duration).toBeLessThan(7.6);

    }

  });
});
