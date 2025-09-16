import React, { useState } from 'react';
import axios from 'axios';
import Graph from './Graph';
import DBViewer from './components/DBViewer';

function App() {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [metric, setMetric] = useState('euclidean');
  const [vectorColumn, setVectorColumn] = useState('content_vector');
  const [view, setView] = useState('graph');

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:3001/api/search-vectors?query=${searchTerm}&metric=${metric}&vectorColumn=${vectorColumn}`);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data: ', error);
      setError('Failed to fetch data. Please make sure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMetricChange = (event) => {
    setMetric(event.target.value);
  };

  const handleVectorColumnChange = (event) => {
    setVectorColumn(event.target.value);
  };

  const toggleView = () => {
    setView(view === 'graph' ? 'db' : 'graph');
  }

  return (
    <div className="App">
      <button onClick={toggleView}>
        {view === 'graph' ? 'Switch to DB Viewer' : 'Switch to Graph View'}
      </button>
      {view === 'graph' ? (
        <div>
          <h1>Vector Embedding Visualization</h1>
          <p>
            This tool visualizes vector embeddings from a database. The graph view shows the relationships between different data points based on their vector similarity. The DB viewer allows you to explore the raw data and visualize high-dimensional vector embeddings in a 2D space using Principal Component Analysis (PCA).
          </p>
          <div>
            <input
              type="text"
              placeholder="Search for an article title..."
              value={searchTerm}
              onChange={handleSearchTermChange}
            />
            <button onClick={handleSearch}>Search</button>
          </div>
          <select onChange={handleMetricChange} value={metric}>
            <option value="euclidean">Euclidean</option>
            <option value="cosine">Cosine</option>
            <option value="inner_product">Inner Product</option>
          </select>
          <select onChange={handleVectorColumnChange} value={vectorColumn}>
            <option value="title_vector">Title Vector</option>
            <option value="content_vector">Content Vector</option>
          </select>
          {loading && <p>Loading...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && <Graph data={data} searchTerm={searchTerm} />}
        </div>
      ) : (
        <DBViewer />
      )}
    </div>
  );
}

export default App;
