const mongoCategoryService = require('../services/mongo/category.service');
const categoryService = require('../services/category.service');
const ingredientService = require('../services/ingredient.service');
const categorySerializer = require('../serializers/category.serializer');

const index = (req, res) => {
  categoryService.find({})
    .then(json =>
      Promise.all(
        json.map(category =>
          ingredientService.find({ categoryId: category.id })
            .then(ingredients => categorySerializer.serialize(category, ingredients)))))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  categoryService.find({ ids: [req.params.id] })
    .then(json =>
      ingredientService.find({ categoryId: req.params.id })
        .then(ingredients => [ json, ingredients ]))
    .then(([ json, ingredients ]) =>
      (json && json.length) ? categorySerializer.serialize(json[0], ingredients) : {})
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  mongoCategoryService.create(Object.assign({}, req.body, { ingredient_ids: [] }))
    .then(json =>
      categoryService.create(Object.assign({}, json, { display_order: json.order }))
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  mongoCategoryService.update(req.params.id, req.body)
    .then(json => {
      if (!req.body.name) {
        return json;
      }

      return categoryService.updateName(req.params.id, req.body.name)
        .then(() => json);
    })
    .then(json => {
      if (!req.body.order) {
        return json;
      }

      return categoryService.updateDisplayOrder(req.params.id, req.body.order)
        .then(() => json);
    })
    .then(json => {
      if (!req.body.ingredient_ids) {
        return json;
      }

      return ingredientService.updateCategoryForAll(req.body.ingredient_ids, req.params.id)
        .then(() => json);
    })
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  mongoCategoryService.deleteOne(req.params.id)
    .then(json =>
      categoryService.deleteOne(req.params.id)
        .then(() => json))
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

module.exports = {
  index,
  show,
  create,
  update,
  destroy
};
