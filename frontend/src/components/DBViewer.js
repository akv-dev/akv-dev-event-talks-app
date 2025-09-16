import React, { useState, useEffect } from 'react';
import EmbeddingVisualizer from './EmbeddingVisualizer';

const DBViewer = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState([]);
  const [data, setData] = useState([]);
  const [visualize, setVisualize] = useState(false);
  const [vectorColumns, setVectorColumns] = useState([]);
  const [selectedVectorColumn, setSelectedVectorColumn] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/tables')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTables(data);
        } else {
          setTables([]);
        }
      })
      .catch(err => console.error('Error fetching tables:', err));
  }, []);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
    setVisualize(false);
    setSelectedVectorColumn(null);
    setVectorColumns([]);

    fetch(`http://localhost:3001/api/table-details?schema=${table.schema}&table=${table.name}`)
      .then(res => res.json())
      .then(details => {
        setSchema(details.schema);
        setData(details.data);
        const vecCols = details.schema.filter(col => col.data_type === 'vector');
        setVectorColumns(vecCols);
      })
      .catch(err => console.error(`Error fetching details for ${table.name}:`, err));
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
            <li key={`${table.schema}.${table.name}`} onClick={() => handleTableSelect(table)}>
              {`${table.schema}.${table.name}`}
            </li>
          ))}
        </ul>
      </div>
      {selectedTable && (
        <div>
          <h3>{`${selectedTable.schema}.${selectedTable.name}`}</h3>
          {vectorColumns.length > 0 && (
            <div>
              <select onChange={(e) => setSelectedVectorColumn(e.target.value)} value={selectedVectorColumn || ''}>
                <option value="" disabled>Select a vector column</option>
                {vectorColumns.map(col => (
                  <option key={col.column_name} value={col.column_name}>{col.column_name}</option>
                ))}
              </select>
              <button onClick={handleVisualize} disabled={!selectedVectorColumn}>Visualize Embeddings</button>
            </div>
          )}
          {visualize ? (
            <EmbeddingVisualizer schema={selectedTable.schema} table={selectedTable.name} column={selectedVectorColumn} />
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
