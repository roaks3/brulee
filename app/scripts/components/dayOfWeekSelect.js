'use strict';

class DayOfWeekSelectCtrl {

  $onInit () {
    // TODO: Provide a date as context so it doesn't always use this week
    this.days = _.map(_.range(7), (num) => {
      let dayMoment = moment().day(num);
      return {
        num: num,
        moment: dayMoment,
        name: dayMoment.format('dddd')
      };
    });
  }

  dayName (num) {
    return (_.find(this.days, {num}) || {}).name;
  }

}

angular.module('bruleeApp')
  .component('dayOfWeekSelect', {
    bindings: {
      selectedDay: '<',
      inputDisabled: '<',
      onChange: '&'
    },
    controller: DayOfWeekSelectCtrl,
    templateUrl: 'views/dayOfWeekSelect.html'
  });
