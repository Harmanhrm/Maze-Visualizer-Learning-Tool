import React, { useState } from 'react';
import './App.css';

function App() {
  const [mazeSize, setMazeSize] = useState(20);
  const [algorithm, setAlgorithm] = useState('recursive');
  const [visualization, setVisualization] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const handleGenerateMaze = async () => {
    console.log(`Generating maze with size: ${mazeSize} and algorithm: ${algorithm}`);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/generate_maze?size=${mazeSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const { maze, steps } = await response.json();
      
      console.log('Maze generated', maze, steps);
      setVisualization(maze);
      setSteps(steps);
      setCurrentStepIndex(0); // Reset to the beginning step
    } catch (error) {
      console.error('Error fetching maze:', error);
    }
  };

  const containerSize = Math.min(window.innerWidth, window.innerHeight) * 0.27; // 90% of the smaller viewport dimension
  const cellSize = containerSize / mazeSize; // Calculate cell size based on maze size and container size

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="App">
      <div className="controls">
        <div>
          <label>Size: </label>
          <input type="range" min="5" max="50" value={mazeSize} onChange={(e) => setMazeSize(parseInt(e.target.value))} />
          <span>
            {mazeSize}x{mazeSize}
          </span>
        </div>
        <div>
          <label>Algorithm: </label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}>
            <option value="prim">Prim</option>
            <option value="recursive">Recursive</option>
            <option value="kruskal">Kruskal</option>
            <option value="wilson">Wilson</option>
          </select>
        </div>
        <button onClick={handleGenerateMaze}>Generate Maze</button>
      </div>
      <div className="row-container">
        <div className="visualization-container">
          <div className="visualization">
            {visualization.length > 0 && (
              <div>
                {visualization.map((row, rowIndex) => (
                  <div key={rowIndex} style={{ display: 'flex' }}>
                    {row.map((cell, cellIndex) => (
                      <div
                        key={cellIndex}
                        className={`cell ${cell === 0 ? 'path' : ''}`}
                        style={{
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          backgroundColor: cell === 1 ? 'black' : cell === 0 ? 'white' : 'red',
                        }}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="steps-container">
  <div className="steps-top-row">
    <div className={`step ${currentStepIndex === 0 ? 'highlighted' : ''}`}>Initialize maze with walls</div>
    <div className={`step ${currentStepIndex === 1 ? 'highlighted' : ''}`}>Start at the top-left corner (0,0)</div>
    <div className={`step ${currentStepIndex === 2 ? 'highlighted' : ''}`}>Mark the start cell as a path</div>
    <div className={`step ${currentStepIndex === 3 ? 'highlighted' : ''}`}>Initialize stack with the start position</div>
  </div>
  <div className="steps-list">
    <div className={`step ${currentStepIndex === 4 ? 'highlighted' : ''}`}>While stack is not empty:</div>
    <div className={`step ${currentStepIndex === 5 ? 'highlighted' : ''} indented`}>Get current position from stack</div>
    <div className={`step ${currentStepIndex === 6 ? 'highlighted' : ''} indented`}>Shuffle directions</div>
    <div className={`step ${currentStepIndex === 7 ? 'highlighted' : ''} indented`}>For each direction:</div>
    <div className={`step ${currentStepIndex === 8 ? 'highlighted' : ''} indented deeper`}>Calculate new position</div>
    <div className={`step ${currentStepIndex === 9 ? 'highlighted' : ''} indented deeper`}>If new position is within bounds and is a wall:</div>
    <div className={`step ${currentStepIndex === 10 ? 'highlighted' : ''} indented deepest`}>Mark new position as a path</div>
    <div className={`step ${currentStepIndex === 11 ? 'highlighted' : ''} indented deepest`}>Mark path between positions</div>
    <div className={`step ${currentStepIndex === 12 ? 'highlighted' : ''} indented deepest`}>Add new position to stack</div>
    <div className={`step ${currentStepIndex === 13 ? 'highlighted' : ''} indented deepest`}>Break loop</div>
    <div className={`step ${currentStepIndex === 14 ? 'highlighted' : ''} indented`}>If no moves possible, backtrack (pop stack)</div>
    <div className={`step ${currentStepIndex === 15 ? 'highlighted' : ''}`}>Maze generation complete</div>
  </div>
</div>

      </div>
    </div>
  );
}

export default App;
