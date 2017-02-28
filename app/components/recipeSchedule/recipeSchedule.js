import angular from 'angular';

import recipeScheduleDay from '../recipeScheduleDay/recipeScheduleDay';

import template from './recipeSchedule.html';
import './recipeSchedule.scss';

class RecipeScheduleCtrl {

  $onInit () {
    this.days = _.range(0, 7);
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
