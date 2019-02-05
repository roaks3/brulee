const fetch = require('node-fetch');

const find = (collection, { q, s, l } = {}) =>
  fetch(`${process.env.API_URL}/${collection}?apiKey=${process.env.API_KEY}${q ? `&q=${q}` : ''}${s ? `&s=${s}` : ''}${l ? `&l=${l}` : ''}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json());

const findOne = (collection, id) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json());

const create = (collection, obj) =>
  fetch(`${process.env.API_URL}/${collection}?apiKey=${process.env.API_KEY}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: obj
  })
    .then(res => res.json());

const update = (collection, id, obj) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: obj
  })
    .then(res => res.json());

const deleteOne = (collection, id) =>
  fetch(`${process.env.API_URL}/${collection}/${id}?apiKey=${process.env.API_KEY}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json());

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne
};
