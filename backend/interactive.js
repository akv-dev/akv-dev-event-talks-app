const express = require('express');
const router = express.Router();
const db = require('./db');
const { PCA } = require('pca-js');

router.get('/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    res.json(result.rows.map(row => row.table_name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tables/:tableName/schema', async (req, res) => {
  try {
    const { tableName } = req.params;
    const result = await db.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = $1
    `, [tableName]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tables/:tableName/data', async (req, res) => {
  try {
    const { tableName } = req.params;
    const result = await db.query(`SELECT * FROM ${tableName}`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tables/:tableName/visualize', async (req, res) => {
  try {
    const { tableName } = req.params;
    const result = await db.query(`SELECT * FROM ${tableName}`);
    const data = result.rows;

    const embeddings = data.map(row => {
        if (typeof row.embedding === 'string') {
            return JSON.parse(row.embedding);
        }
        return row.embedding;
    });

    if (embeddings.some(e => e === null || e === undefined)) {
        return res.status(400).json({ error: 'Embeddings contain null or undefined values.' });
    }
    
    const pca = new PCA(embeddings);
    const reducedEmbeddings = pca.predict(embeddings, { nComponents: 2 });
    
    const visualizationData = data.map((row, i) => ({
      ...row,
      embedding_2d: reducedEmbeddings.data[i],
    }));

    res.json(visualizationData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
