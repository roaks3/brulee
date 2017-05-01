import moment from 'moment';
import angular from 'angular';

import recipeScheduleDay from '../recipeScheduleDay/recipeScheduleDay';

import template from './recipeSchedule.html';
import './recipeSchedule.scss';

class RecipeScheduleCtrl {

  $onInit () {
    const start = moment(this.groceryList.week_start, 'YYYY-MM-DD').day();
    this.days = _.range(0, 7).map(day => (day + start) % 7);
  }

}

export default angular.module('components.recipeSchedule', [recipeScheduleDay])
  .component('recipeSchedule', {
    template,
    bindings: {
      groceryList: '<'
    },
    controller: RecipeScheduleCtrl,
    controllerAs: 'vm'
  })
  .name;
