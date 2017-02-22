import moment from 'moment';
import angular from 'angular';

import groceryListPageStore from '../../scripts/services/groceryListPageStore';

import template from './recipeScheduleDay.html';
import './recipeScheduleDay.scss';

class RecipeScheduleDayCtrl {

  constructor (groceryListPageStore) {
    'ngInject';

    this.groceryListPageStore = groceryListPageStore;
  }

  $onInit () {
    this.dayName = moment().day(this.dayOfWeek).format('dddd');
    this.isToday = moment().day() === this.dayOfWeek;
    this.recipes = this.groceryListPageStore.selectRecipesForDayOfWeek(this.dayOfWeek);
  }

}

export default angular.module('components.recipeScheduleDay', [groceryListPageStore])
  .component('recipeScheduleDay', {
    template,
    bindings: {
      dayOfWeek: '<'
    },
    controller: RecipeScheduleDayCtrl,
    controllerAs: 'vm'
  })
  .name;
