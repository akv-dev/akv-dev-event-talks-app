const { Pool } = require('pg');
const pgvector = require('pgvector/pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.on('connect', async (client) => {
  await pgvector.registerType(client);
});

const distanceOperators = {
  euclidean: '<->',
  cosine: '<=>',
  inner_product: '<#>',
};

async function getSearchBasedGraphData(searchQuery, vectorColumn = 'content_vector', metric = 'euclidean', limit = 10) {
  const operator = distanceOperators[metric] || distanceOperators.euclidean;
  const allowedColumns = ['title_vector', 'content_vector'];
  if (!allowedColumns.includes(vectorColumn)) {
    throw new Error(`Invalid vector column name: ${vectorColumn}`);
  }

  const startArticleQuery = {
    text: `SELECT id, title, \"${vectorColumn}\" AS embedding FROM articles WHERE title ILIKE $1 LIMIT 1`,
    values: [`%${searchQuery}%`],
  };
  const startArticleResult = await pool.query(startArticleQuery);
  if (startArticleResult.rows.length === 0) {
    return { nodes: [], links: [] };
  }
  const startArticle = startArticleResult.rows[0];

  const neighborsQuery = {
    text: `
      SELECT
        id,
        title,
        \"${vectorColumn}\" AS embedding,
        \"${vectorColumn}\