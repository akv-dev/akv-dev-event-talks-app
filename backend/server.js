require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getSearchBasedGraphData } = require('./db');

const app = express();
const port = 3001;

app.use(cors());

const interactiveRouter = require('./interactive');
app.use('/api', interactiveRouter);

app.get('/api/search-vectors', async (req, res) => {
  try {
    const { query, vectorColumn, metric, limit } = req.query;
    const graphData = await getSearchBasedGraphData(query, vectorColumn, metric, limit);
    res.json(graphData);
  } catch (err) {
    console.error('Error fetching search-based graph data:', err);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
