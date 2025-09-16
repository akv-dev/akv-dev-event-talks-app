const express = require('express');
const router = express.Router();
const db = require('./db');
const { PCA } = require('pca-js');

router.get('/tables', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_schema != 'pg_catalog' AND table_schema != 'information_schema'
    `);
    res.json(result.rows.map(row => ({ schema: row.table_schema, name: row.table_name })));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/table-details', async (req, res) => {
  try {
    const { schema, table } = req.query;

    const schemaResult = await db.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = $1 AND table_name = $2
    `, [schema, table]);

    const dataResult = await db.query(`SELECT * FROM "${schema}"."${table}"`);

    res.json({
      schema: schemaResult.rows,
      data: dataResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/visualize', async (req, res) => {
  try {
    const { schema, table, column } = req.query;
    const result = await db.query(`SELECT * FROM "${schema}"."${table}"`);
    const data = result.rows;

    const embeddings = data.map(row => {
        if (typeof row[column] === 'string') {
            return JSON.parse(row[column]);
        }
        return row[column];
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