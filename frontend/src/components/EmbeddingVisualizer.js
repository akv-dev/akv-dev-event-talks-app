import React, { useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const EmbeddingVisualizer = ({ schema, table }) => {
  const [visualizationData, setVisualizationData] = useState(null);

  useEffect(() => {
    if (schema && table) {
      fetch(`http://localhost:3001/api/visualize?schema=${schema}&table=${table}`)
        .then(res => res.json())
        .then(data => {
            const chartData = {
                datasets: [
                  {
                    label: `${schema}.${table} Embeddings`,
                    data: data.map(item => ({ x: item.embedding_2d[0], y: item.embedding_2d[1] })),
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                  },
                ],
              };
              setVisualizationData(chartData);
        })
        .catch(err => console.error(`Error fetching visualization data for ${table}:`, err));
    }
  }, [schema, table]);

  return (
    <div>
      <h4>Embedding Visualization</h4>
      {visualizationData ? <Scatter data={visualizationData} /> : <p>Loading...</p>}
    </div>
  );
};

export default EmbeddingVisualizer;