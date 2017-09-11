import angular from 'angular';

export default angular.module('services.ingredientParseService', [])

  .service('ingredientParseService', function () {

    this.parseIngredient = function (text) {
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
      var unit = item.match(
        /^[Cc]ups*|^[Tt]sps*|^[Tt]easpoons*|^[Tt]bsps*|^[Tt]ablespoons*|^[Ll]bs*|^[Pp]ounds*|^[Oo]z|^[Oo]unces*/
      );
      if (unit === null) {
        // Do nothing
      } else {
        unit = '' + unit;
        item = item.substr(unit.length);

        item = item.trim();
      }

      return {
        ingredient: {
          name: item
        },
        unit: unit,
        amount: amount
      };
    };

    this.parseAll = function (text) {
      if (text === null) {
        return null;
      }

      var ingredients = [];
      var unparsedIngredients = text.split('\n');
      for (var i = 0; i < unparsedIngredients.length; i++) {
        var ingredient = this.parseIngredient(unparsedIngredients[i]);
        if (ingredient !== null) {
          ingredients.push(ingredient);
        }
      }

      return ingredients;
    };

    return this;

  })
  .name;
