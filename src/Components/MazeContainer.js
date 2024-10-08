import React from 'react';
import MazeVisualizer from './MazeVisualizer';
import PositionDisplay from './PositionsDisplay';

const MazeContainer = ({ visualization, cellSize, currentPosition }) => {
  return (
    <div className="maze-container">
      <div className="row-container">
        <div className="visualization-container">
          <MazeVisualizer visualization={visualization} cellSize={cellSize} />
        </div>
      </div>
      <PositionDisplay currentPosition={currentPosition} />
    </div>
  );
};

export default MazeContainer;