'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Immutable = require('immutable');
var Map = Immutable.Map;
var List = Immutable.List;
var Set = Immutable.Set;

var defaultYear = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

var Timeseries = function () {
  function Timeseries(data) {
    _classCallCheck(this, Timeseries);

    this.data = data || Map();
  }

  _createClass(Timeseries, [{
    key: 'set',
    value: function set(year, month, value) {
      var newData = this.data.update(year.toString(), defaultYear, function (months) {
        return months.set(month, value);
      });
      return new Timeseries(newData);
    }
  }, {
    key: 'get',
    value: function get(year, month) {
      return this.data.get(year.toString(), defaultYear).get(month);
    }
  }, {
    key: 'add',
    value: function add(other) {
      var result = this.data.mergeWith(function (a, b) {
        return a.zipWith(function (x, y) {
          return x + y;
        }, b);
      }, other.data);
      return new Timeseries(result);
    }
  }, {
    key: 'getMinimumDate',
    value: function getMinimumDate() {
      var years = this.data.keySeq().map(function (y) {
        return parseInt(y, 10);
      });
      if (years.size === 0) return null;
      var year = Math.min.apply(null, years.toJS());
      return {
        month: 0,
        year: year
      };
    }
  }, {
    key: 'getMaximumDate',
    value: function getMaximumDate() {
      var years = this.data.keySeq().map(function (y) {
        return parseInt(y, 10);
      });
      if (years.size === 0) return null;
      var year = Math.max.apply(null, years.toJS());
      return {
        month: 11,
        year: year
      };
    }
  }, {
    key: 'setRange',
    value: function setRange(startYear, startMonth, endYear, endMonth, value, defaultValue) {
      var result = new Timeseries(this.data);
      for (var year = startYear; year <= endYear; year++) {
        var i = 0;
        var j = 11;
        if (year === startYear) {
          i = startMonth;
        }
        if (year === endYear) {
          j = endMonth;
        }
        for (var month = i; month <= j; month++) {
          result = result.set(year, month, value);
        }
      }
      return result;
    }
  }, {
    key: 'setGrowth',
    value: function setGrowth(startYear, startMonth, endYear, endMonth, startValue, growth, round) {
      var result = new Timeseries(this.data);
      var calculated = startValue;
      for (var year = startYear; year <= endYear; year++) {
        var i = 0;
        var j = 11;
        if (year === startYear) {
          i = startMonth;
        }
        if (year === endYear) {
          j = endMonth;
        }
        for (var month = i; month <= j; month++) {
          result = result.set(year, month, round ? Math.round(calculated) : calculated);
          calculated = calculated + calculated * growth;
        }
      }
      return result;
    }
  }, {
    key: 'getRange',
    value: function getRange(startYear, startMonth, endYear, endMonth, defaultValue) {
      var result = List();
      var defaultValues = defaultValue ? this._createDefaultYear(defaultValue) : defaultYear;
      var i = void 0,
          j = void 0;
      for (var year = startYear; year <= endYear; year++) {
        i = 0;
        j = 11;
        if (year === startYear) {
          i = startMonth;
        }
        if (year === endYear) {
          j = endMonth;
        }
        result = result.concat(this.data.get(year.toString(), defaultValues).slice(i, j + 1));
      }
      return result;
    }
  }, {
    key: '_createDefaultYear',
    value: function _createDefaultYear(value) {
      return List([value, value, value, value, value, value, value, value, value, value, value, value]);
    }
  }], [{
    key: 'getMinimumDate',
    value: function getMinimumDate(timeseries) {
      var dates = timeseries.map(function (timeseries) {
        return timeseries.getMinimumDate();
      });
      dates = dates.filter(function (date) {
        return date !== null;
      });
      if (!dates.length) {
        return null;
      }
      dates = dates.map(function (item) {
        return new Date(item.year, item.month);
      });
      var minDate = new Date(Math.min.apply(null, dates));
      return {
        year: minDate.getFullYear(),
        month: minDate.getMonth()
      };
    }
  }, {
    key: 'getMaximumDate',
    value: function getMaximumDate(timeseries) {
      var dates = timeseries.map(function (timeseries) {
        return timeseries.getMaximumDate();
      });
      dates = dates.filter(function (date) {
        return date !== null;
      });
      if (!dates.length) {
        return null;
      }
      dates = dates.map(function (item) {
        return new Date(item.year, item.month);
      });
      var maxDate = new Date(Math.max.apply(null, dates));
      return {
        year: maxDate.getFullYear(),
        month: maxDate.getMonth()
      };
    }
  }]);

  return Timeseries;
}();

module.exports = Timeseries;

