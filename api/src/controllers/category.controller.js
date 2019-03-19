const mongoCategoryService = require('../services/mongo/category.service');
const categoryService = require('../services/category.service');
const ingredientService = require('../services/ingredient.service');
const categorySerializer = require('../serializers/category.serializer');

const index = async req => {
  const categories = await categoryService.find({});

  return Promise.all(
    categories.map(async category => {
      const ingredients = await ingredientService.find({
        categoryId: category.id
      });
      return categorySerializer.serialize(category, ingredients);
    })
  );
};

const show = async req => {
  const categories = await categoryService.find({ ids: [req.params.id] });
  const ingredients = await ingredientService.find({
    categoryId: req.params.id
  });

  return categories && categories.length
    ? categorySerializer.serialize(categories[0], ingredients)
    : {};
};

const create = async req => {
  const created = await mongoCategoryService.create(
    Object.assign({}, req.body, { ingredient_ids: [] })
  );

  await categoryService.create(
    Object.assign({}, created, { display_order: created.order })
  );

  return created;
};

const update = async req => {
  const updated = await mongoCategoryService.update(req.params.id, req.body);

  if (req.body.name) {
    await categoryService.updateName(req.params.id, req.body.name);
  }

  if (req.body.order) {
    await categoryService.updateDisplayOrder(req.params.id, req.body.order);
  }

  if (req.body.ingredient_ids) {
    await ingredientService.updateCategoryForAll(
      req.body.ingredient_ids,
      req.params.id
    );
  }

  return updated;
};

const destroy = async req => {
  const deleted = await mongoCategoryService.deleteOne(req.params.id);

  await categoryService.deleteOne(req.params.id);

  return deleted;
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
