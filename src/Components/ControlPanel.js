import React from 'react';

const ControlPanel = ({ tempMazeSize, setTempMazeSize, algorithm, setAlgorithm, showSteps, setShowSteps, isGenerating }) => {
  return (
    <div className="controls">
      <div>
        <label>Size: </label>
        <input type="range" min="5" max="50" value={tempMazeSize} onChange={(e) => setTempMazeSize(parseInt(e.target.value))} disabled={isGenerating} />
        <span>{tempMazeSize}x{tempMazeSize}</span>
      </div>
      <div>
        <label>Algorithm: </label>
        <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)} disabled={isGenerating}>
          <option value="prim">Prim - In Development</option>
          <option value="recursive">Recursive</option>
          <option value="kruskal">Kruskal - In Development</option>
          <option value="wilson">Wilson - In Development</option>
        </select>
        <label>
          <input 
            type="checkbox" 
            checked={showSteps} 
            onChange={(e) => setShowSteps(e.target.checked)}
            disabled={isGenerating} 
          />
          Steps
        </label>
      </div>
    </div>
  );
};

export default ControlPanel;