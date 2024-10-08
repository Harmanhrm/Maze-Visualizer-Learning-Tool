import React from 'react';

const PositionDisplay = ({ currentPosition }) => {
  return (
    <div className="position-display">
      {currentPosition && (
        <div>
          <p>Current Position: x={currentPosition[0]}, y={currentPosition[1]}</p>
        </div>
      )}
    </div>
  );
};

export default PositionDisplay;