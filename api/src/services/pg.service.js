const _ = require('lodash');
const { SQL } = require('sql-template-strings');
const pg = require('pg');
const knex = require('knex');

const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

const pgQuery = sql =>
  pgPool.connect().then(connection =>
    connection
      .query(sql)
      .then(result => {
        connection.release();
        return result && result.rows;
      })
      .catch(e => {
        connection.release();
        throw e;
      })
  );

const knexClient = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL
});

module.exports = {
  pgQuery,
  knex: knexClient
};
