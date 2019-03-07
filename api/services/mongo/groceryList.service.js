const mongo = require('./mongo.service');

const find = ({ limit, sortMostRecent }) => {
  let query = {};

  if (limit) {
    query.l = limit;
  }

  if (sortMostRecent) {
    query.s = encodeURI(JSON.stringify({
      week_start: -1
    }));
  }

  return mongo.find('groceryLists', query);
};

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
