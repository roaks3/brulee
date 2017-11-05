import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';

import Recipe from '../../scripts/datastores/Recipe';

import template from './recipeTypeahead.html';
import './recipeTypeahead.scss';

class RecipeTypeaheadCtrl {

  constructor (Recipe) {
    'ngInject';

    this.Recipe = Recipe;
    this.recipes = [];
    this._selectedRecipe = {};
  }

  $onInit () {
    this._selectedRecipe = _.cloneDeep(this.selectedRecipe);
    this.Recipe
      .refreshAll()
      .then(data => {
        this.recipes = data;
      });
  }

  $onChanges (changesObj) {
    if (changesObj.selectedRecipe) {
      this._selectedRecipe = _.cloneDeep(changesObj.selectedRecipe.currentValue);
    }
  }

  onChange (recipe) {
    if (_.isString(recipe)) {
      this._selectedRecipe = {name: recipe};
    }
    this.onSelect({recipe: this._selectedRecipe});
  }

  isValid () {
    return this._selectedRecipe && this._selectedRecipe.id;
  }

}

export default angular.module('components.recipeTypeahead', [uiBootstrap, Recipe])
  .component('recipeTypeahead', {
    template,
    bindings: {
      inputDisabled: '<',
      selectedRecipe: '<',
      onSelect: '&'
    },
    controller: RecipeTypeaheadCtrl
  })
  .name;
