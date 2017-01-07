const Immutable = require('immutable');
const Map = Immutable.Map;
const List = Immutable.List;
const Set = Immutable.Set;

const defaultYear = List([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

function createDefaultYear(value) {
  return List([value, value, value, value, value, value, value, value, value, value, value, value]);
}

class Timeseries {
  constructor(data) {
    this.data = data || Map();
  }
  set(year, month, value) {
    const newData = this.data.update(year, defaultYear, (months) => months.set(month, value));
    return new Timeseries(newData);
  }
  get(year, month) {
    return this.data.get(year, defaultYear).get(month);
  }
  add(other) {
    const result = this.data.mergeWith((a, b) => a.zipWith((x, y) => x + y, b), other.data);
    return new Timeseries(result);
  }
  getRange(startYear, startMonth, endYear, endMonth, defaultValue) {
    let result = List();
    const defaultValues = defaultValue ? createDefaultYear(defaultValue) : defaultYear;
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
      result = result.concat(this.data.get(year, defaultValues).slice(i, j + 1));
    }
    return result;
  }
}

module.exports = Timeseries;
