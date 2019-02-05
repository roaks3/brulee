const groceryListService = require('../services/groceryList.service');

const index = (req, res) => {
  groceryListService.find(req.query)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const show = (req, res) => {
  groceryListService.findOne(req.params.id)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const create = (req, res) => {
  groceryListService.create(req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const update = (req, res) => {
  groceryListService.update(req.params.id, req.body)
    .then(json => res.send(json))
    .catch(e => console.log(e));
};

const destroy = (req, res) => {
  groceryListService.deleteOne(req.params.id)
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
