export class DateSplitter {
  static parseISODate(s) {
    let b = s.split(/\D/);
    let d = new Date(b[0], b[1] ? b[1] - 1 : 0, b[2] || 1);
    return d && d.getMonth() === b[1] - 1 ? d : new Date(NaN);
  }

  static toISODate(date) {
    return date.getDate() ? ('000' + date.getFullYear()).slice(-4) + '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
      ('0' + date.getDate()).slice(-2) : date.toString();
  }

  static genDatesInRange(fromDate, toDate, monthly) {
    let s = this.parseISODate(fromDate);
    let e = this.parseISODate(toDate);
    let dates = [];

    // Check that dates are valid
    if (!s.getDate() || !e.getDate()) return;

    let start_date
    let end_date
    while (s <= e) {
      start_date = (monthly ? this.toISODate(s) : this.toISODate(s));
      if (monthly) {
        s.setMonth(s.getMonth() + 1);
        end_date = new Date(s.setDate(s.getDate() - 1));
        s.setDate(s.getDate() + 1);
      } else {
        s.setMonth(s.getMonth() + 3);
        end_date = new Date(s.setDate(s.getDate() - 1));
        s.setDate(s.getDate() + 1);
      }
      if (end_date > e) {
        end_date = e;
      }
      dates.push({'start_date': start_date, 'end_date': this.toISODate(end_date)});
    }
    let firstDateString = (monthly ? 'M' : 'Q');
    let counter = 1;
    let addLabelsToDate = []
    $.each(dates, function (index, value) {
      if (index === 0) {
        addLabelsToDate.push({
          'datePeriod': firstDateString + '' + counter,
          'startDate': value['start_date'],
          'endDate': value['end_date'],
        });
      } else {
        addLabelsToDate.push({
          'datePeriod': firstDateString + '' + counter,
          'startDate': value['start_date'],
          'endDate': value['end_date'],
        });
      }
      counter++;
    });
    return addLabelsToDate;
  }
}
