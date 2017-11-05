import angular from 'angular';

import categoryStore from './categoryStore';
import groceryListStore from './groceryListStore';
import ingredientStore from './ingredientStore';
import recipeStore from './recipeStore';

const UNCATEGORIZED = {
  name: 'Uncategorized',
  order: 0
};

class SelectedGroceryListStore {

  constructor ($q, categoryStore, groceryListStore, ingredientStore, recipeStore) {
    'ngInject';

    this.$q = $q;
    this.categoryStore = categoryStore;
    this.groceryListStore = groceryListStore;
    this.ingredientStore = ingredientStore;
    this.recipeStore = recipeStore;
  }

  fetchSelectedGroceryList (id) {
    return this.groceryListStore
      .fetchGroceryListById(id)
      .then(() => {
        this.selectedGroceryList = this.groceryListStore.selectGroceryListById(id);
      });
  }

  fetchAllForSelectedGroceryList () {
    let recipes = [];
    return this.$q
      .all([
        this.recipeStore.fetchRecipesForGroceryList(this.selectedGroceryList),
        this.categoryStore.fetchAllCategories()
      ])
      .then(() => {
        recipes = this.recipeStore.selectRecipesForGroceryList(this.selectedGroceryList);
      })
      .then(() => this.ingredientStore.fetchIngredientsForGroceryList(this.selectedGroceryList, recipes));
  }

  setSelectedGroceryList (groceryList) {
    this.selectedGroceryList = groceryList;
  }

  addIngredientToGroceryList (ingredient) {
    const groceryList = Object.assign({}, this.selectedGroceryList, {
      additional_ingredients: [
        ...this.selectedGroceryList.additional_ingredients || [],
        {
          ingredient_id: ingredient.id,
          amount: 1
        }
      ]
    });

    return this.groceryListStore
      .updateGroceryList(groceryList)
      .then(() => {
        this.ingredientStore.addIngredient(ingredient);
        this.selectedGroceryList = this.groceryListStore.selectGroceryListById(groceryList.id);
      });
  }

  addRecipeToGroceryList (recipe, dayOfWeek) {
    const groceryList = Object.assign({}, this.selectedGroceryList, {
      recipe_days: [
        ...this.selectedGroceryList.recipe_days || [],
        {
          recipe_id: recipe.id,
          day_of_week: dayOfWeek
        }
      ]
    });

    return this.groceryListStore
      .updateGroceryList(groceryList)
      .then(() => {
        this.recipeStore.addRecipe(recipe);
        this.selectedGroceryList = this.groceryListStore.selectGroceryListById(groceryList.id);
      });
  }

  removeRecipeFromGroceryList (recipe, dayOfWeek) {
    const groceryList = Object.assign({}, this.selectedGroceryList, {
      recipe_days: this.selectedGroceryList.recipe_days.filter(recipeDay => {
        return recipeDay.recipe_id !== recipe.id || recipeDay.day_of_week !== dayOfWeek;
      })
    });

    return this.groceryListStore
      .updateGroceryList(groceryList)
      .then(() => {
        this.selectedGroceryList = this.groceryListStore.selectGroceryListById(groceryList.id);
      });
  }

  selectCategories () {
    const ingredients = this.selectIngredients();
    const ingredientIds = ingredients.map(ingredient => ingredient.id);
    let categories = this.categoryStore.selectCategoriesForIngredients(ingredientIds);

    // Add Uncategorized if there are ingredients with no category
    const categorizedIngredientIds = _(categories).map('ingredient_ids').flatten().uniq().value();
    const uncategorized =
      ingredients.some(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    if (uncategorized) {
      categories = [...categories, UNCATEGORIZED];
    }

    return _.sortBy(categories, 'order');
  }

  selectIngredients () {
    const recipes = this.recipeStore.selectRecipesForGroceryList(this.selectedGroceryList);
    return this.ingredientStore.selectIngredientsForGroceryList(this.selectedGroceryList, recipes);
  }

  selectIngredientsForCategory (categoryId) {
    const ingredients = this.selectIngredients();
    const category = this.categoryStore.selectCategoryById(categoryId);
    if (!category) {
      const categories = this.categoryStore.selectAllCategories();
      const categorizedIngredientIds = _(categories).map('ingredient_ids').flatten().uniq().value();
      return ingredients.filter(ingredient => !categorizedIngredientIds.includes(ingredient.id));
    }
    return ingredients.filter(ingredient => category.ingredient_ids.includes(ingredient.id));
  }

  selectRecipesForIngredient (ingredientId) {
    const recipes = this.recipeStore.selectRecipesForGroceryList(this.selectedGroceryList);
    return recipes.filter(recipe => {
      return _.map(recipe.recipe_ingredients, 'ingredient_id').includes(ingredientId);
    });
  }

  selectRecipesForDayOfWeek (dayOfWeek) {
    const recipes = this.recipeStore.selectRecipesForGroceryList(this.selectedGroceryList);
    const recipeIds = this.selectedGroceryList.recipe_days
      .filter(recipeDay => recipeDay.day_of_week === dayOfWeek)
      .map(recipeDay => recipeDay.recipe_id);

    return recipes.filter(recipe => recipeIds.includes(recipe.id));
  }

}

export default angular
  .module('services.selectedGroceryListStore', [
    categoryStore,
    groceryListStore,
    ingredientStore,
    recipeStore
  ])
  .service('selectedGroceryListStore', SelectedGroceryListStore)
  .name;
