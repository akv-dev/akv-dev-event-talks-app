import React from 'react';
import { ForceGraph2D } from 'react-force-graph-2d';

const Graph = ({ data, searchTerm }) => {
  const handleNodeClick = (node) => {
    const message = `Text: ${node.name}\nEmbedding: [${node.embedding}]`;
    alert(message);
  };

  const nodeCanvasObject = (node, ctx, globalScale) => {
    const label = node.name;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Sans-Serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = node.color;
    ctx.fillText(label, node.x, node.y);

    if (searchTerm && node.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      ctx.strokeStyle = 'yellow';
      ctx.lineWidth = 2 / globalScale;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI, false);
      ctx.stroke();
    }
  };

  return (
    <ForceGraph2D
      graphData={data}
      nodeLabel="name"
      nodeAutoColorBy="name"
      linkDirectionalParticles={1}
      linkLabel="distance"
      onNodeClick={handleNodeClick}
      nodeCanvasObject={nodeCanvasObject}
    />
  );
};

export default Graph;