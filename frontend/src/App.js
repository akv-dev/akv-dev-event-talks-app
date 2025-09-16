import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Graph from './Graph';

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    axios.get('http://localhost:3001/api/vectors')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Vector Embedding Visualization</h1>
      <Graph data={data} />
    </div>
  );
}

export default App;
