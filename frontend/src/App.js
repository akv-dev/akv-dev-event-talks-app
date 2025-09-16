import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Graph from './Graph';
import DBViewer from './components/DBViewer';

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [metric, setMetric] = useState('euclidean');
  const [view, setView] = useState('graph');

  useEffect(() => {
    if (view === 'graph') {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/api/vectors?metric=${metric}`);
          setData(response.data);
        } catch (error) {
          console.error('Error fetching data: ', error);
          setError('Failed to fetch data. Please make sure the backend server is running.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [metric, view]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  const toggleView = () => {
    setView(view === 'graph' ? 'db' : 'graph');
  }

  const filteredNodes = data.nodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLinks = data.links.filter(link => {
    const sourceNode = data.nodes.find(node => node.id === link.source);
    const targetNode = data.nodes.find(node => node.id === link.target);
    return sourceNode && targetNode &&
           (sourceNode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            targetNode.name.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const graphData = searchTerm ? { nodes: filteredNodes, links: filteredLinks } : data;

  return (
    <div className="App">
      <button onClick={toggleView}>
        {view === 'graph' ? 'Switch to DB Viewer' : 'Switch to Graph View'}
      </button>
      {view === 'graph' ? (
        <div>
          <h1>Vector Embedding Visualization</h1>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select onChange={handleMetricChange} value={metric}>
            <option value="euclidean">Euclidean</option>
            <option value="cosine">Cosine</option>
            <option value="inner_product">Inner Product</option>
          </select>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && <Graph data={graphData} searchTerm={searchTerm} />}
        </div>
      ) : (
        <DBViewer />
      )}
    </div>
  );
}

export default App;
