const _ = require('lodash');
const mongo = require('./mongo.service');

const find = ({ ids }) => {
  let q = {};

  if (ids) {
    q._id = {
      $in: ids.map(id => ({$oid: id}))
    };
  }

  q = _.isEmpty(q) ? undefined : encodeURI(JSON.stringify(q));

  return mongo.find('recipes', { q });
};

const findOne = id =>
  mongo.findOne('recipes', id);

const create = obj =>
  mongo.create('recipes', obj);

const update = (id, obj) =>
  mongo.update('recipes', id, obj);

const deleteOne = id =>
  mongo.deleteOne('recipes', id);

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
