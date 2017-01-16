const Immutable = require('immutable');
const Map = Immutable.Map;
const List = Immutable.List;
const Set = Immutable.Set;

const defaultYear = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

class Timeseries {
  constructor(data) {
    this.data = data || Map();
  }
  set(year, month, value) {
    const newData = this.data.update(year.toString(), defaultYear, (months) => months.set(month, value));
    return new Timeseries(newData);
  }
  get(year, month) {
    return this.data.get(year.toString(), defaultYear).get(month);
  }
  add(other) {
    const result = this.data.mergeWith((a, b) => a.zipWith((x, y) => x + y, b), other.data);
    return new Timeseries(result);
  }
  getMinimumDate() {
    const years = this.data.keySeq().map(y => parseInt(y, 10));
    if (years.size === 0) return null;
    const year = Math.min.apply(null, years.toJS());
    return {
      month: 0,
      year,
    };
  }
  getMaximumDate() {
    const years = this.data.keySeq().map(y => parseInt(y, 10));
    if (years.size === 0) return null;
    const year = Math.max.apply(null, years.toJS());
    return {
      month: 11,
      year,
    };
  }
  setRange(startYear, startMonth, endYear, endMonth, value, defaultValue) {
    let result = new Timeseries(this.data);
    for (let year = startYear; year <= endYear; year++) {
      let i = 0;
      let j = 11;
      if (year === startYear) {
        i = startMonth;
      }
      if (year === endYear) {
        j = endMonth;
      }
      for (let month = i; month <= j; month++) {
        result = result.set(year, month, value);
      }
    }
    return result;
  }
  getRange(startYear, startMonth, endYear, endMonth, defaultValue) {
    let result = List();
    const defaultValues = defaultValue ? this._createDefaultYear(defaultValue) : defaultYear;
    let i, j;
    for (let year = startYear; year <= endYear; year++) {
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
  _createDefaultYear(value) {
    return List([value, value, value, value, value, value, value, value, value, value, value, value]);
  }
  static getMinimumDate(timeseries) {
    let dates = timeseries.map(timeseries => timeseries.getMinimumDate());
    dates = dates.filter(date => date !== null);
    if (!dates.length) {
      return null;
    }
    dates = dates.map(item => new Date(item.year, item.month));
    const minDate = new Date(Math.min.apply(null, dates));
    return {
      year: minDate.getFullYear(),
      month: minDate.getMonth(),
    };
  }
  static getMaximumDate(timeseries) {
    let dates = timeseries.map(timeseries => timeseries.getMaximumDate());
    dates = dates.filter(date => date !== null);
    if (!dates.length) {
      return null;
    }
    dates = dates.map(item => new Date(item.year, item.month));
    const maxDate = new Date(Math.max.apply(null, dates));
    return {
      year: maxDate.getFullYear(),
      month: maxDate.getMonth(),
    };
  }
}

module.exports = Timeseries;
