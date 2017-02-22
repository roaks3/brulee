import moment from 'moment';
import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import template from './dayOfWeekSelect.html';

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

export default angular.module('components.dayOfWeekSelect', [uiBootstrap])
  .component('dayOfWeekSelect', {
    template,
    bindings: {
      selectedDay: '<',
      inputDisabled: '<',
      onChange: '&'
    },
    controller: DayOfWeekSelectCtrl
  })
  .name;
