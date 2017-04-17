const expect = require('chai').expect;
const Timeseries = require('../src/timeseries');

describe('timeseries', function() {
  describe('constructor', function() {
    it('default constructor should create an empty time series', function() {
      const series = new Timeseries();
      expect(series.data.size).to.equal(0);
    });
  });
  
  describe('set', function() {
    it('should add new value into empty timeseries', function() {
      let series = new Timeseries();
      series = series.set(2017, 1, 100);
      expect(series.get(2017, 1)).to.equal(100);
    });
    
    it('should update existing value', function() {
      let series = new Timeseries();
      series = series.set(2017, 1, 100);
      series = series.set(2017, 1, 200);
      expect(series.get(2017, 1)).to.equal(200);
    });
  });
  
  describe('add', function() {
    it('should add two empty timeseries', function() {
      const a = new Timeseries();
      const b = new Timeseries();
      const result = a.add(b);
      expect(result.data.size).to.equal(0);
    });
    
    it('should add one empty and one entry timeseries', function() {
      let a = new Timeseries();
      let b = new Timeseries();
      b = b.set(2017, 1, 100);
      const result = a.add(b);
      expect(result.get(2017, 1)).to.equal(100);
    });
    
    it('should add two timeseries', function() {
      let a = new Timeseries();
      let b = new Timeseries();
      a = a.set(2017, 1, 50);
      b = b.set(2017, 1, 100);
      const result = a.add(b);
      expect(result.get(2017, 1)).to.equal(150);
    });
  });
  
  describe('getRange', function() {
    it('should get values in range', function() {
      let a = new Timeseries();
      a = a.set(2017, 2, 50);
      a = a.set(2017, 5, 25);
      expect(a.getRange(2017, 0, 2017, 6).toJS()).to.eql([0, 0, 50, 0, 0, 25, 0]);
    });
    
    it('should get values in range across years', function() {
      let a = new Timeseries();
      a = a.set(2017, 2, 50);
      a = a.set(2017, 5, 25);
      expect(a.getRange(2016, 10, 2017, 6).toJS()).to.eql([0, 0, 0, 0, 50, 0, 0, 25, 0]);
    });
    
    it('should use default value', function() {
      let a = new Timeseries();
      expect(a.getRange(2016, 10, 2017, 6, 5).toJS()).to.eql([5, 5, 5, 5, 5, 5, 5, 5, 5]);
    });
  });
  
  describe('setRange', function() {
    it('should set values in range', function() {
      let ts = new Timeseries();
      ts = ts.setRange(2017, 2, 2017, 5, 20);
      expect(ts.getRange(2017, 1, 2017, 6).toJS()).to.eql([0, 20, 20, 20, 20, 0]);
    });
  });
  
  describe('getMinimumDate', function() {
    it('should get the smallest date that is stored', function() {
      let ts = new Timeseries();
      ts = ts.setRange(2016, 2, 2017, 5, 20);
      expect(ts.getMinimumDate()).to.eql({year: 2016, month: 0});
    });
  });
  
  describe('getMinimumDate static', function() {
    it('should get the smallest date that is stored in multiple timeseries', function() {
      let a = new Timeseries();
      let b = new Timeseries();
      a = a.setRange(2016, 2, 2017, 5, 20);
      b = b.setRange(2016, 1, 2017, 5, 20);
      expect(Timeseries.getMinimumDate([a, b])).to.eql({year: 2016, month: 0});
    });
    it('should handle empty timeseries', function() {
      const ts = new Timeseries();
      expect(Timeseries.getMinimumDate([ts])).to.equal(null);
    });
  });
  
  describe('setGrowth', function() {
    it('should set the values following a growth pattern', function() {
      let a = new Timeseries();
      a = a.setGrowth(2017, 1, 2017, 3, 10, 0.1, false);
      expect(a.getRange(2017, 1, 2017, 3).toJS()).to.eql([10, 11, 12.1]);
    });
    it('should set the values following a growth pattern with rounded values', function() {
      let a = new Timeseries();
      a = a.setGrowth(2017, 1, 2017, 3, 10, 0.1, true);
      expect(a.getRange(2017, 1, 2017, 3).toJS()).to.eql([10, 11, 12]);
    });
  });
});
