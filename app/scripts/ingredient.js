
'use strict';

var Ingredient = (function() {

  var Ingredient = function(item, amount) {
    this.item = item;
    this.amount = amount;
  };

  Ingredient.parse = function(text) {
    if (text === null) {
      return null;
    }

    text = text.trim();
    if (text === '') {
      return null;
    }

    // Parse out the ingredient amount
    var amount = text.match(/^\d[\/\. \d]*/);
    var item = text;
    if (amount === null) {
      amount = '1';
    } else {
      amount = '' + amount;
      item = text.substr(amount.length);

      amount = amount.trim();
      item = item.trim();
    }

    // Parse out the ingredient units
    var unit = item.match(/^[Cc]ups*|^[Tt]sps*|^[Tt]easpoons*|^[Tt]bsps*|^[Tt]ablespoons*|^[Ll]bs*|^[Pp]ounds*|^[Oo]z|^[Oo]unces*/);
    if (unit === null) {
      // Do nothing
    } else {
      unit = '' + unit;
      item = item.substr(unit.length);

      item = item.trim();
    }

    return new Ingredient(item, amount);
  };

  return Ingredient;

} ());

var Ingredients = (function() {

  var Ingredients = function() {
  };

  Ingredients.parse = function(text) {
    if (text === null) {
      return null;
    }

    var ingredients = [];
    var unparsedIngredients = text.split('\n');
    for (var i = 0; i < unparsedIngredients.length; i++) {
      var ingredient = Ingredient.parse(unparsedIngredients[i]);
      if (ingredient !== null) {
        ingredients.push(ingredient);
      }
    }

    return ingredients;
  };

  // Slow search functionality
  Ingredients.getByItem = function(ingredients, item) {
    for (var i = 0; i < ingredients.length; i++) {
      var ingredient = ingredients[i];
      if (ingredient.item === item) {
        return ingredient;
      }
    }
    return null;
  };

  Ingredients.combine = function(ingredients, otherIngredient) {
    if (otherIngredient === null) {
      return ingredients;
    }

    var item = otherIngredient.item;
    //var amount = otherIngredient.amount;

    for (var i = 0; i < ingredients.length; i++) {
      var existingIngredient = ingredients[i];
      if (existingIngredient.item === item) {
        existingIngredient.amount++;
        //existingIngredient.amount = Ratio.parse(existingIngredient.amount).add(amount).simplify().toLocaleString();
        return ingredients;
      }
    }

    // Ingredient does not exist yet
    ingredients.push({item: otherIngredient.item, amount: 1});

    return ingredients;
  };

  Ingredients.combineAll = function(ingredients, otherIngredients) {
    for (var i = 0; i < otherIngredients.length; i++) {
      var otherIngredient = otherIngredients[i];
      ingredients = Ingredients.combine(ingredients, otherIngredient);
    }
    return ingredients;
  };

  return Ingredients;

} ());

var Recipe = (function() {

  var Recipe = function(name, ingredients, originalText) {
    this.name = name;
    this.ingredients = [];
    if (ingredients !== null) {
      this.ingredients = Ingredients.combineAll(this.ingredients, ingredients);
    }
    this.originalText = originalText;
  };

  Recipe.prototype.addIngredient = function(ingredient) {
    if (ingredient === null) {
      return;
    }

    this.ingredients = Ingredients.combine(this.ingredients, ingredient);
  };

  return Recipe;

} ());

var Category = (function() {

  var Category = function(id, name, order, items) {
    this.id = id;
    this.name = name;
    this.order = order;
    this.items = [];
    if (items !== null) {
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        this.items.push(item);
      }
    }
  };

  Category.prototype.addItem = function(item) {
    if (item === null) {
      return;
    }

    this.items.push(item);
  };

  return Category;

} ());
