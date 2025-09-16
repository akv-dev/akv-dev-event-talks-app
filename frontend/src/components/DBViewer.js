import React, { useState, useEffect } from 'react';
import EmbeddingVisualizer from './EmbeddingVisualizer';

const DBViewer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [visualize, setVisualize] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3001/api/tables')
      .then(res => res.json())
      .then(data => setTables(data))
      .catch(err => console.error('Error fetching tables:', err));
  }, []);

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
    setVisualize(false);

    fetch(`http://localhost:3001/api/tables/${tableName}/schema`)
      .then(res => res.json())
      .then(data => setSchema(data))
      .catch(err => console.error(`Error fetching schema for ${tableName}:`, err));

    fetch(`http://localhost:3001/api/tables/${tableName}/data`)
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(`Error fetching data for ${tableName}:`, err));
  };

  const handleVisualize = () => {
    setVisualize(true);
  };

  return (
    <div>
      <h2>Database Viewer</h2>
      <div>
        <h3>Tables</h3>
        <ul>
          {tables.map(table => (
            <li key={table} onClick={() => handleTableSelect(table)}>
              {table}
            </li>
          ))}
        </ul>
      </div>
      {selectedTable && (
        <div>
          <h3>{selectedTable}</h3>
          {schema.find(col => col.column_name === 'embedding') && (
            <button onClick={handleVisualize}>Visualize Embeddings</button>
          )}
          {visualize ? (
            <EmbeddingVisualizer table={selectedTable} />
          ) : (
            <table>
              <thead>
                <tr>
                  {schema.map(col => <th key={col.column_name}>{col.column_name}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={i}>
                    {schema.map(col => (
                      <td key={col.column_name}>
                        {typeof row[col.column_name] === 'object' ? JSON.stringify(row[col.column_name]) : row[col.column_name]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DBViewer;
