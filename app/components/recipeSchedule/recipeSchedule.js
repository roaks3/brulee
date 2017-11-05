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

  toggleEdit () {
    this.editing = true;
  }

}

export default angular.module('components.recipeSchedule', [recipeScheduleDay])
  .component('recipeSchedule', {
    template,
    bindings: {
      groceryList: '<',
      onChange: '&'
    },
    controller: RecipeScheduleCtrl
  })
  .name;
