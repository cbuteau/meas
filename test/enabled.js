var meas;
describe('Exercise API', function() {
  beforeAll(function(done) {
    require(['meas'], function(measLoad) {
      meas = measLoad;
      meas.enable(false);
      window.performance.clearMeasures();
      done();
    });
  });

  it ('Run loop disabled', function() {
    meas.start('loop');

    var array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17];
    for ( var i = 0; i < array.length; i++) {
      console.log(array[i]);
    }
    meas.end('loop');
    var measures = window.performance.getEntriesByType('measure');
    expect(measures.length).toBe(0);
  });
});
