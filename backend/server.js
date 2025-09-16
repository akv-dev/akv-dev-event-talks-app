require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get('/api/vectors', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, text, embedding::text FROM embeddings');
    const embeddings = result.rows;

    const graphData = {
      nodes: [],
      links: [],
    };

    for (const embedding of embeddings) {
      graphData.nodes.push({ id: embedding.id, name: embedding.text });

      const closestMatch = await pool.query(
        'SELECT id, text, embedding <-> $1 AS distance FROM embeddings WHERE id != $2 ORDER BY distance LIMIT 1',
        [embedding.embedding, embedding.id]
      );

      if (closestMatch.rows.length > 0) {
        graphData.links.push({ source: embedding.id, target: closestMatch.rows[0].id });
      }
    }

    res.json(graphData);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
