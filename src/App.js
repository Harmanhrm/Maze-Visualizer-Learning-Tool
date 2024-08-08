import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [mazeSize, setMazeSize] = useState(20);
  const [algorithm, setAlgorithm] = useState('recursive');
  const [visualization, setVisualization] = useState({ maze: [], currentPath: [] });
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false); // Checkbox state
  const [animationSpeed, setAnimationSpeed] = useState(100); // Default speed (milliseconds)

  useEffect(() => {
    let timeoutId;
    if (steps.length > 0 && showSteps) {
      const updateStep = () => {
        setCurrentStepIndex(prevIndex => {
          if (prevIndex >= steps.length - 1) {
            clearTimeout(timeoutId); // Stop animation when steps are complete
            return prevIndex;
          }
          timeoutId = setTimeout(updateStep, animationSpeed); // Use animationSpeed for delay
          return prevIndex + 1;
        });
      };
      timeoutId = setTimeout(updateStep, animationSpeed); // Start the animation
    } else {
      clearTimeout(timeoutId); // Cleanup on stop
    }
  
    console.log('Current Animation Speed:', animationSpeed); // Debugging line
  
    return () => clearTimeout(timeoutId); // Cleanup on component unmount
  }, [steps, showSteps, animationSpeed]); // Add animationSpeed to dependencies
  
  useEffect(() => {
    if (steps.length > 0 && showSteps) {
      applyStepsToMaze();
    }
  }, [currentStepIndex, steps, showSteps]);

  const handleGenerateMaze = async () => {
    console.log(`Generating maze with size: ${mazeSize} and algorithm: ${algorithm}`);
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/generate_maze?size=${mazeSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const { maze, steps } = await response.json();
      
      console.log('Maze generated', maze, steps);
      setVisualization({ maze, currentPath: Array(maze.length).fill(null).map(() => Array(maze[0].length).fill(0)) });
      setSteps(steps);
      setCurrentStepIndex(0); // Reset to the beginning step
    } catch (error) {
      console.error('Error fetching maze:', error);
    }
  };

  const containerSize = Math.min(window.innerWidth, window.innerHeight) * 0.27; // 27% of the smaller viewport dimension
  const cellSize = containerSize / mazeSize; // Calculate cell size based on maze size and container size
  const applyStepsToMaze = () => {
    // Initialize maze with walls
    let maze = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(1));
    const stack = [];
    let currentPath = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(0));
    
    let previousPosition = null;
    
    for (let i = 0; i <= currentStepIndex; i++) {
      const step = steps[i];
      switch (step[0]) {
        case 0:
          // Reset the maze to walls
          maze = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(1));
          currentPath = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(0));
          break;
        case 1:
          // Mark the start cell as a path
          const [startX, startY] = step[2];
          maze[2 * startX + 1][2 * startY + 1] = 0;
          currentPath[2 * startX + 1][2 * startY + 1] = 2;
          previousPosition = [startX, startY];
          break;
        case 9:
          // Update maze and path based on current position
          const [nx, ny] = step[2];
          maze[2 * nx + 1][2 * ny + 1] = 0;
          currentPath[2 * nx + 1][2 * ny + 1] = 2;
          if (previousPosition) {
            const [px, py] = previousPosition;
            // Mark the path between previous and current cells
            const dx = nx - px;
            const dy = ny - py;
            maze[2 * px + 1 + dx][2 * py + 1 + dy] = 0;
            currentPath[2 * px + 1 + dx][2 * py + 1 + dy] = 2;
          }
          previousPosition = [nx, ny];
          break;
        case 10:
          // Push current position onto stack
          stack.push(step[2]);
          break;
        case 11:
          // Pop from stack and update previous position
          const poppedPosition = stack.pop();
          if (poppedPosition) {
          if (stack.length > 0) {
            previousPosition = stack[stack.length - 1];
          } else {
            previousPosition = null;
          }
  
          // Revert the maze and path to the state before this step
          const [px, py] = poppedPosition;
          currentPath[2 * px + 1][2 * py + 1] = 0; // Reset path
          if (previousPosition) {
            const [prevX, prevY] = previousPosition;
            const dx = px - prevX;
            const dy = py - prevY;
            
            currentPath[2 * prevX + 1 + dx][2 * prevY + 1 + dy] = 0; // Reset path
          }
        }
          break;
        default:
          break;
      }
    }
    
    setVisualization({ maze, currentPath });
  };

  const getStepHighlightClass = (stepType) => {
    if (currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      if (currentStep[0] === stepType) {
        return 'highlighted';
      }
    }
    return '';
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
          <label>
            <input 
              type="checkbox" 
              checked={showSteps} 
              onChange={(e) => setShowSteps(e.target.checked)}
            />
            Steps
          </label>
        </div>
        <button onClick={handleGenerateMaze}>Generate Maze</button>
      </div>
      <div className="row-container">
        <div className="visualization-container">
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
        </div>
        <div className="steps-container left-align">
          <div className="steps-top-row">
            <div className={`step ${getStepHighlightClass(0)}`}>Initialize maze with walls</div>
            <div className={`step ${getStepHighlightClass(1)}`}>Mark the start cell as a path</div>
            <div className={`step ${getStepHighlightClass(2)}`}>Initialize stack with the start position</div>
          </div>
          <div className="steps-list right-align">
            <div className={`step ${getStepHighlightClass(3)}`}>While stack is not empty:</div>
            <div className={`step ${getStepHighlightClass(4)} indented`}>Get current position from stack</div>
            <div className={`step ${getStepHighlightClass(5)} indented`}>Shuffle directions</div>
            <div className={`step ${getStepHighlightClass(6)} indented`}>For each direction:</div>
            <div className={`step ${getStepHighlightClass(7)} indented deeper`}>Calculate new position</div>
            <div className={`step ${getStepHighlightClass(8)} indented deeper`}>If new position is within bounds and is a wall:</div>
            <div className={`step ${getStepHighlightClass(9)} indented deepest`}>Mark new position as a path</div>
            <div className={`step ${getStepHighlightClass(10)} indented deepest`}>Add new position to stack</div>
            <div className={`step ${getStepHighlightClass(11)} indented`}>If no moves possible, backtrack (pop stack)</div>
            <div className={`step ${getStepHighlightClass(12)}`}>Maze generation complete</div>
          </div>
        </div>
      </div>
      <div className="animation-speed-container">
        <label>Animation Speed (ms): </label>
        <input
          type="range"
          min="50"
          max="10000"
          value={animationSpeed}
          onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
        />
        <span>{animationSpeed} ms</span>
      </div>
    </div>
  );
}

export default App;
