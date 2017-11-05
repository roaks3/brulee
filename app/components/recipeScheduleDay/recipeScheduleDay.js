import moment from 'moment';
import angular from 'angular';

import selectedGroceryListStore from '../../store/selectedGroceryListStore';
import addRecipeForm from '../addRecipeForm/addRecipeForm';

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

  toggleAddRecipe () {
    this.addingRecipe = true;
  }

  addRecipe (recipe) {
    this.selectedGroceryListStore
      .addRecipeToGroceryList(recipe, this.dayOfWeek)
      .then(() => {
        this.addingRecipe = false;
        this.onChange();
      });
  }

  removeRecipe (recipe) {
    this.selectedGroceryListStore
      .removeRecipeFromGroceryList(recipe, this.dayOfWeek)
      .then(() => {
        this.onChange();
      });
  }

}

export default angular.module('components.recipeScheduleDay', [selectedGroceryListStore, addRecipeForm])
  .component('recipeScheduleDay', {
    template,
    bindings: {
      groceryList: '<',
      dayOfWeek: '<',
      editing: '<',
      onChange: '&'
    },
    controller: RecipeScheduleDayCtrl
  })
  .name;
