import React from 'react';

const MazeVisualizer = ({ visualization, cellSize }) => {
  return (
    <div className="visualization">
      {visualization.maze.length > 0 && (
        <div>
          {visualization.maze.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`cell ${cell === 0 ? 'path' : ''}`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    backgroundColor: cell === 1 ? 'black' : (visualization.currentPath[rowIndex][cellIndex] === 2 ? 'green' : 'white'),
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MazeVisualizer;