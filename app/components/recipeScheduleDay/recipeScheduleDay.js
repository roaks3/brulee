import moment from 'moment';
import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';

import template from './recipeScheduleDay.html';
import './recipeScheduleDay.scss';

class RecipeScheduleDayCtrl {

  constructor (selectedGroceryListStore) {
    'ngInject';

    this.selectedGroceryListStore = selectedGroceryListStore;
  }

  $onInit () {
    this.dayName = moment().day(this.dayOfWeek).format('dddd');
    this.isToday = moment().day() === this.dayOfWeek;
  }

  $onChanges (changesObj) {
    if (changesObj.groceryList) {
      this.recipes = this.selectedGroceryListStore
        .selectRecipesForDayOfWeek(this.dayOfWeek);
    }
  }

}

export default angular.module('components.recipeScheduleDay', [selectedGroceryListStore])
  .component('recipeScheduleDay', {
    template,
    bindings: {
      groceryList: '<',
      dayOfWeek: '<'
    },
    controller: RecipeScheduleDayCtrl,
    controllerAs: 'vm'
  })
  .name;
