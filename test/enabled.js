//var meas;
describe('Exercise API', function() {
  beforeAll(function(done) {
    // require(['meas'], function(measLoad) {
    //   meas = measLoad;
    //   meas.perfPtr.clearMeasures();
    //   //window.performance.clearMeasures();
    //   meas.enable(false);
    //   done();
    // });
    meas.perfPtr.clearMeasures();
    //window.performance.clearMeasures();
    meas.enable(false);
    done();

  });

  afterAll(function() {
    meas.enable(true);
  });

  it ('Run loop disabled', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');
    expect(meas.endnmeas('loop')).toBe(undefined);
    meas.meas('loop');
    var measures = meas.perfPtr.getEntriesByType('measure');
    expect(measures.length).toBe(0);
  });
});
