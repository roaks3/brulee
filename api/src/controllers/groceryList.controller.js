const _ = require('lodash');
const moment = require('moment');
const groceryListService = require('../services/groceryList.service');
const groceryListSerializer = require('../serializers/groceryList.serializer');

const index = async req => {
  const groceryLists = await groceryListService.find({
    ids: _.isString(req.query.ids) ? [req.query.ids] : req.query.ids,
    limit: req.query.limit,
    sortMostRecent: req.query.sortMostRecent
  });

  return Promise.all(
    groceryLists.map(async groceryList => {
      const [groceryListRecipes, groceryListIngredients] = await Promise.all([
        groceryListService.findGroceryListRecipes({
          groceryListIds: [groceryList.id]
        }),
        groceryListService.findGroceryListIngredients({
          groceryListIds: [groceryList.id]
        })
      ]);
      return groceryListSerializer.serialize(
        groceryList,
        groceryListRecipes,
        groceryListIngredients
      );
    })
  );
};

const show = async req => {
  const groceryLists = await groceryListService.find({ ids: [req.params.id] });

  const [groceryListRecipes, groceryListIngredients] = await Promise.all([
    groceryListService.findGroceryListRecipes({
      groceryListIds: [req.params.id]
    }),
    groceryListService.findGroceryListIngredients({
      groceryListIds: [req.params.id]
    })
  ]);

  return groceryLists && groceryLists.length
    ? groceryListSerializer.serialize(
        groceryLists[0],
        groceryListRecipes,
        groceryListIngredients
      )
    : {};
};

const recipeDayToGroceryListRecipe = (groceryListId, weekStart, recipeDay) => {
  let dowMoment =
    weekStart && moment(weekStart, 'YYYY-MM-DD').day(recipeDay.day_of_week);
  if (dowMoment && dowMoment.isBefore(moment(weekStart, 'YYYY-MM-DD'))) {
    dowMoment = dowMoment.add(7, 'days');
  }

  return {
    grocery_list_id: groceryListId,
    recipe_id: recipeDay.recipe_id,
    day_of_week: recipeDay.day_of_week,
    scheduled_for: dowMoment && dowMoment.toDate()
  };
};

const createGroceryListRecipe = (groceryListId, weekStart, recipeDay) =>
  groceryListService.createGroceryListRecipe(
    recipeDayToGroceryListRecipe(groceryListId, weekStart, recipeDay)
  );

const createGroceryListIngredient = (groceryListId, additionalIngredient) =>
  groceryListService.createGroceryListIngredient(
    Object.assign({}, additionalIngredient, { grocery_list_id: groceryListId })
  );

const create = async req => {
  const created = await groceryListService.create(req.body);
  const createdGroceryListRecipes = await Promise.all(
    (req.body.recipe_days || []).map(recipeDay =>
      createGroceryListRecipe(created.id, created.week_start, recipeDay)
    )
  );
  const createdGroceryListIngredients = await Promise.all(
    (req.body.additional_ingredients || []).map(additionalIngredient =>
      createGroceryListIngredient(created.id, additionalIngredient)
    )
  );

  return groceryListSerializer.serialize(
    created,
    createdGroceryListRecipes,
    createdGroceryListIngredients
  );
};

const updateGroceryListRecipesForGroceryList = (
  groceryListId,
  weekStart,
  oldGroceryListRecipes,
  newGroceryListRecipeDays
) => {
  const createdRecipeDays = newGroceryListRecipeDays.filter(
    nrd =>
      !oldGroceryListRecipes.find(
        ord =>
          ord.recipe_id === nrd.recipe_id && ord.day_of_week === nrd.day_of_week
      )
  );
  const removedRecipeDays = oldGroceryListRecipes.filter(
    ord =>
      !newGroceryListRecipeDays.find(
        nrd =>
          nrd.recipe_id === ord.recipe_id && nrd.day_of_week === ord.day_of_week
      )
  );

  return Promise.all([
    ...createdRecipeDays.map(rd =>
      createGroceryListRecipe(groceryListId, weekStart, rd)
    ),
    ...removedRecipeDays.map(rd =>
      groceryListService.deleteOneGroceryListRecipe(
        groceryListId,
        rd.recipe_id,
        rd.day_of_week
      )
    )
  ]);
};

const updateGroceryListIngredientsForGroceryList = (
  groceryListId,
  oldGroceryListIngredients,
  newGroceryListAdditionalIngredients
) => {
  const createdAdditionalIngredients = (
    newGroceryListAdditionalIngredients || []
  ).filter(
    nai =>
      !(oldGroceryListIngredients || []).find(
        oai => oai.ingredient_id === nai.ingredient_id
      )
  );
  const removedAdditionalIngredients = (oldGroceryListIngredients || []).filter(
    oai =>
      !(newGroceryListAdditionalIngredients || []).find(
        nai => nai.ingredient_id === oai.ingredient_id
      )
  );
  const changedAdditionalIngredients = (
    newGroceryListAdditionalIngredients || []
  ).filter(nai =>
    (oldGroceryListIngredients || []).find(
      oai =>
        oai.ingredient_id === nai.ingredient_id &&
        (oai.amount !== nai.amount || oai.unit !== nai.unit)
    )
  );

  return Promise.all([
    ...createdAdditionalIngredients.map(ai =>
      createGroceryListIngredient(groceryListId, ai)
    ),
    ...removedAdditionalIngredients.map(ai =>
      groceryListService.deleteOneGroceryListIngredient(
        groceryListId,
        ai.ingredient_id
      )
    ),
    ...changedAdditionalIngredients.map(ai =>
      groceryListService.updateGroceryListIngredient(
        groceryListId,
        ai.ingredient_id,
        ai
      )
    )
  ]);
};

const update = async req => {
  const updated = await groceryListService.update(req.params.id, req.body);
  const originalGroceryListRecipes = await groceryListService.findGroceryListRecipes(
    {
      groceryListIds: [req.params.id]
    }
  );
  const originalGroceryListIngredients = await groceryListService.findGroceryListIngredients(
    {
      groceryListIds: [req.params.id]
    }
  );

  await updateGroceryListRecipesForGroceryList(
    req.params.id,
    updated.week_start,
    originalGroceryListRecipes,
    req.body.recipe_days
  );
  await updateGroceryListIngredientsForGroceryList(
    req.params.id,
    originalGroceryListIngredients,
    req.body.additional_ingredients
  );

  const [
    updatedGroceryListRecipes,
    updatedGroceryListIngredients
  ] = await Promise.all([
    groceryListService.findGroceryListRecipes({
      groceryListIds: [req.params.id]
    }),
    groceryListService.findGroceryListIngredients({
      groceryListIds: [req.params.id]
    })
  ]);

  return groceryListSerializer.serialize(
    updated,
    updatedGroceryListRecipes,
    updatedGroceryListIngredients
  );
};

const destroy = async req => {
  await groceryListService.deleteGroceryListIngredientsForGroceryList(
    req.params.id
  );
  await groceryListService.deleteGroceryListRecipesForGroceryList(
    req.params.id
  );

  const deleted = await groceryListService.deleteOne(req.params.id);

  return groceryListSerializer.serialize(deleted, [], []);
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
