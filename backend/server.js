require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getGraphData } = require('./db');

const app = express();
const port = 3001;

app.use(cors());

app.get('/api/vectors', async (req, res) => {
  try {
    const { metric } = req.query;
    const graphData = await getGraphData(metric);
    res.json(graphData);
  } catch (err) {
    console.error('Error fetching graph data:', err);
    res.status(500).json({ error: 'Failed to fetch graph data' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
