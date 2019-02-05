const mongo = require('./mongo.service');

const find = opts =>
  mongo.find('groceryLists', opts);

const findOne = id =>
  mongo.findOne('groceryLists', id);

const create = obj =>
  mongo.create('groceryLists', obj);

const update = (id, obj) =>
  mongo.update('groceryLists', id, obj);

const deleteOne = id =>
  mongo.deleteOne('groceryLists', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
