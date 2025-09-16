import React from 'react';
import { ForceGraph2D } from 'react-force-graph-2d';

const Graph = ({ data }) => {
  return (
    <ForceGraph2D
      graphData={data}
      nodeLabel="name"
      nodeAutoColorBy="name"
      linkDirectionalParticles={1}
    />
  );
};

export default Graph;
