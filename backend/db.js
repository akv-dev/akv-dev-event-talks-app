const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const distanceOperators = {
  euclidean: '<->',
  cosine: '<=>',
  inner_product: '<#>',
};

async function getGraphData(metric = 'euclidean', vectorColumn = 'content_vector') {
  const operator = distanceOperators[metric] || distanceOperators.euclidean;
  const allowedColumns = ['title_vector', 'content_vector'];
  if (!allowedColumns.includes(vectorColumn)) {
    throw new Error(`Invalid vector column name: ${vectorColumn}`);
  }

  const query = `
    WITH distances AS (
      SELECT
        e1.id AS source_id,
        e1.title AS source_text,
        e1."${vectorColumn}" AS source_embedding,
        e2.id AS target_id,
        e1."${vectorColumn}" ${operator} e2."${vectorColumn}" AS distance,
        ROW_NUMBER() OVER(PARTITION BY e1.id ORDER BY e1."${vectorColumn}" ${operator} e2."${vectorColumn}") as rn
      FROM
        articles e1
      CROSS JOIN
        articles e2
      WHERE
        e1.id != e2.id
    )
    SELECT
      source_id,
      source_text,
      source_embedding,
      target_id,
      distance
    FROM
      distances
    WHERE
      rn = 1;
  `;

  const result = await pool.query(query);
  const nodes = [];
  const links = [];
  const nodeIds = new Set();

  for (const row of result.rows) {
    if (!nodeIds.has(row.source_id)) {
      nodes.push({ id: row.source_id, name: row.source_text, embedding: row.source_embedding });
      nodeIds.add(row.source_id);
    }
    links.push({ source: row.source_id, target: row.target_id, distance: row.distance.toFixed(2) });
  }

  return { nodes, links };
}

module.exports = {
  getGraphData,
  query: (text, params) => pool.query(text, params),
};