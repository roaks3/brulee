const moment = require('moment');
const mongoGroceryListService = require('../services/mongo/groceryList.service');
const groceryListService = require('../services/groceryList.service');
const groceryListSerializer = require('../serializers/groceryList.serializer');

const index = (req, res) => {
  groceryListService.find({ ids: req.query.ids })
    .then(json =>
      Promise.all(
        json.map(groceryList =>
          Promise.all([
            groceryListService.findGroceryListRecipes({ groceryListIds: [groceryList.id] }),
            groceryListService.findGroceryListIngredients({ groceryListIds: [groceryList.id] })
          ])
            .then(([groceryListRecipes, groceryListIngredients]) => groceryListSerializer.serialize(groceryList, groceryListRecipes, groceryListIngredients)))))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const recent = (req, res) => {
  groceryListService.find({ limit: req.query.limit, sortMostRecent: true })
    .then(json =>
      Promise.all(
        json.map(groceryList =>
          Promise.all([
            groceryListService.findGroceryListRecipes({ groceryListIds: [groceryList.id] }),
            groceryListService.findGroceryListIngredients({ groceryListIds: [groceryList.id] })
          ])
            .then(([groceryListRecipes, groceryListIngredients]) => groceryListSerializer.serialize(groceryList, groceryListRecipes, groceryListIngredients)))))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  groceryListService.find({ ids: [req.params.id] })
    .then(json =>
      Promise.all([
        groceryListService.findGroceryListRecipes({ groceryListIds: [req.params.id] }),
        groceryListService.findGroceryListIngredients({ groceryListIds: [req.params.id] })
      ])
        .then(([groceryListRecipes, groceryListIngredients]) => [ json, groceryListRecipes, groceryListIngredients ]))
    .then(([ json, groceryListRecipes, groceryListIngredients ]) =>
      json && json.length && groceryListSerializer.serialize(json[0], groceryListRecipes, groceryListIngredients))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const recipeDayToGroceryListRecipe = (groceryList, recipeDay) => {
  let dowMoment = groceryList.week_start && moment(groceryList.week_start, 'YYYY-MM-DD').day(recipeDay.day_of_week);
  if (dowMoment && dowMoment.isBefore(moment(groceryList.week_start, 'YYYY-MM-DD'))) {
    dowMoment = dowMoment.add(7, 'days');
  }

  return {
    grocery_list_id: groceryList.id,
    recipe_id: recipeDay.recipe_id,
    day_of_week: recipeDay.day_of_week,
    scheduled_for: dowMoment && dowMoment.toDate()
  };
};

const createGroceryListRecipe = (groceryList, recipeDay) =>
  groceryListService.createGroceryListRecipe(recipeDayToGroceryListRecipe(groceryList, recipeDay));

const createGroceryListIngredient = (groceryListId, additionalIngredient) =>
  groceryListService.createGroceryListIngredient(
    Object.assign({}, additionalIngredient, { grocery_list_id: groceryListId }));

const create = (req, res) => {
  mongoGroceryListService.create(req.body)
    .then(json =>
      groceryListService.create(json)
        .then(() => json))
    .then(json =>
      Promise
        .all(
          (req.body.recipe_days || []).map(rd =>
            createGroceryListRecipe(json, rd)))
        .then(() => json))
    .then(json =>
      Promise
        .all(
          (req.body.additional_ingredients || []).map(ai =>
            createGroceryListIngredient(json.id, ai)))
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const updateGroceryListRecipesForGroceryList = (oldGroceryList, newGroceryList) => {
  const createdRecipeDays = newGroceryList.recipe_days
    .filter(nrd =>
      !oldGroceryList.recipe_days.find(ord => ord.recipe_id === nrd.recipe_id && ord.day_of_week === nrd.day_of_week));
  const removedRecipeDays = oldGroceryList.recipe_days
    .filter(ord =>
      !newGroceryList.recipe_days.find(nrd => nrd.recipe_id === ord.recipe_id && nrd.day_of_week === ord.day_of_week));

  return Promise.all([
    ...createdRecipeDays.map(rd =>
      createGroceryListRecipe(Object.assign({}, newGroceryList, { id: oldGroceryList.id }), rd)),
    ...removedRecipeDays.map(rd =>
      groceryListService.deleteOneGroceryListRecipe(oldGroceryList.id, rd.recipe_id, rd.day_of_week))]);
};

const updateAdditionalIngredientsForGroceryList = (oldGroceryList, newGroceryList) => {
  const createdAdditionalIngredients = (newGroceryList.additional_ingredients || [])
    .filter(nai =>
      !(oldGroceryList.additional_ingredients || []).find(oai => oai.ingredient_id === nai.ingredient_id));
  const removedAdditionalIngredients = (oldGroceryList.additional_ingredients || [])
    .filter(oai =>
      !(newGroceryList.additional_ingredients || []).find(nai => nai.ingredient_id === oai.ingredient_id));
  const changedAdditionalIngredients = (newGroceryList.additional_ingredients || [])
    .filter(nai =>
      (oldGroceryList.additional_ingredients || []).find(oai =>
        oai.ingredient_id === nai.ingredient_id && (oai.amount !== nai.amount || oai.unit !== nai.unit)));

  return Promise.all([
    ...createdAdditionalIngredients.map(ai =>
      createGroceryListIngredient(oldGroceryList.id, ai)),
    ...removedAdditionalIngredients.map(ai =>
      groceryListService.deleteOneGroceryListIngredient(oldGroceryList.id, ai.ingredient_id)),
    ...changedAdditionalIngredients.map(ai =>
      groceryListService.updateGroceryListIngredient(oldGroceryList.id, ai.ingredient_id, ai))]);
};

const update = (req, res) => {
  let original;
  mongoGroceryListService.findOne(req.params.id)
    .then(json => {
      original = json;
    })
    .then(() => mongoGroceryListService.update(req.params.id, req.body))
    .then(json =>
      groceryListService.update(req.params.id, req.body)
        .then(() => json))
    .then(json =>
      updateGroceryListRecipesForGroceryList(original, req.body)
        .then(() => json))
    .then(json =>
      updateAdditionalIngredientsForGroceryList(original, req.body)
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

module.exports = {
  index,
  recent,
  show,
  create,
  update
};
