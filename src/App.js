import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [mazeSize, setMazeSize] = useState(20);
  const [tempMazeSize, setTempMazeSize] = useState(20); // Used for slider control
  const [algorithm, setAlgorithm] = useState('recursive');
  const [visualization, setVisualization] = useState({ maze: [], currentPath: [] });
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false); // Checkbox state
  const [animationSpeed, setAnimationSpeed] = useState(100); // Default speed (milliseconds)
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepDirection, setStepDirection] = useState(1); // 1 for forward, -1 for backward
  const [currentPosition, setCurrentPosition] = useState(null); // State to hold the current position

  useEffect(() => {
    let timeoutId;
    let tempSteps = [...steps]; // Temporary storage for steps
    let tempIndex = currentStepIndex; // Temporary storage for the current step index
  
    const updateStep = () => {
      setCurrentStepIndex(prevIndex => {
        if (prevIndex >= tempSteps.length - 1 || prevIndex < 0) {
          clearTimeout(timeoutId);
          setIsGenerating(false);
          return prevIndex;
        }
        // Move to the next step only if not paused
        if (!isPaused) {
          timeoutId = setTimeout(updateStep, animationSpeed);
        }
        return prevIndex + stepDirection;
      });
    };
  
    if (steps.length > 0 && showSteps) {
      if (isPlaying && !isPaused) {
        setIsGenerating(true);
        tempSteps = [...steps]; // Update tempSteps when playing
        tempIndex = currentStepIndex; // Update tempIndex when playing
        timeoutId = setTimeout(updateStep, animationSpeed); // Start the animation
      } else if (isPaused || !isPlaying) {
        clearTimeout(timeoutId); // Cleanup timeout if paused or not playing
        setIsGenerating(false);
        // Restore the last state if paused
        setSteps(tempSteps);
        setCurrentStepIndex(tempIndex);
      }
    } else {
      setIsGenerating(false);
      clearTimeout(timeoutId); // Cleanup on stop or empty steps
    }
  
    // Cleanup timeout on component unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [steps, showSteps, animationSpeed, isPlaying, isPaused, stepDirection, currentStepIndex]);
  
  
  
  useEffect(() => {
    if (steps.length > 0 && showSteps) {
      applyStepsToMaze();
    }
  }, [currentStepIndex, steps, showSteps]);

  const handleGenerateMaze = async () => {
    setMazeSize(tempMazeSize);
    setIsPaused(false);
    setIsPlaying(true);
    
    console.log(`Generating maze with size: ${tempMazeSize} and algorithm: ${algorithm}`);
  
    try {
      const response = await fetch(`https://Harmanhrm.pythonanywhere.com/generate_maze?size=${tempMazeSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const { maze, steps } = await response.json();
  
      console.log('Maze generated', maze, steps);
      setVisualization({
        maze,
        currentPath: Array(maze.length).fill(null).map(() => Array(maze[0].length).fill(0)),
      });
      setSteps(steps);
      setCurrentStepIndex(0); // Reset to the beginning step
      setIsGenerating(true); // Indicate that generation is ongoing
      setIsPlaying(false); // Stop automatic playing to allow step-by-step control
    } catch (error) {
      console.error('Error fetching maze:', error);
    }
  };
  
  
  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
  };
  
  const handlePlay = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };
  
  const handleStepForward = () => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStepIndex((prevIndex) => Math.min(prevIndex + 1, steps.length - 1));
  };
  
  const handleStepBackward = () => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStepIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };
  
  const containerSize = Math.min(window.innerWidth, window.innerHeight) * 0.27; // 27% of the smaller viewport dimension
  const cellSize = containerSize / mazeSize; // Calculate cell size based on maze size and container size
  const applyStepsToMaze = () => {
    let maze = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(1));
    const stack = [];
    let currentPath = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(0));
    
    let previousPosition = null;
    
    for (let i = 0; i <= currentStepIndex; i++) {
      const step = steps[i];
      switch (step[0]) {
        case 0:
          maze = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(1));
          currentPath = Array(mazeSize * 2 + 1).fill(null).map(() => Array(mazeSize * 2 + 1).fill(0));
          break;
        case 1:
          const [startX, startY] = step[2];
          maze[2 * startX + 1][2 * startY + 1] = 0;
          currentPath[2 * startX + 1][2 * startY + 1] = 2;
          previousPosition = [startX, startY];
          break;
        case 9:
          const [nx, ny] = step[2];
          maze[2 * nx + 1][2 * ny + 1] = 0;
          currentPath[2 * nx + 1][2 * ny + 1] = 2;
          if (previousPosition) {
            const [px, py] = previousPosition;
            const dx = nx - px;
            const dy = ny - py;
            maze[2 * px + 1 + dx][2 * py + 1 + dy] = 0;
            currentPath[2 * px + 1 + dx][2 * py + 1 + dy] = 2;
          }
          previousPosition = [nx, ny];
          break;
        case 10:
          stack.push(step[2]);
          break;
        case 11:
          const poppedPosition = stack.pop();
          if (poppedPosition) {
            if (stack.length > 0) {
              previousPosition = stack[stack.length - 1];
            } else {
              previousPosition = null;
            }
            const [px, py] = poppedPosition;
            currentPath[2 * px + 1][2 * py + 1] = 0;
            if (previousPosition) {
              const [prevX, prevY] = previousPosition;
              const dx = px - prevX;
              const dy = py - prevY;
              currentPath[2 * prevX + 1 + dx][2 * prevY + 1 + dy] = 0;
            }
          }
          break;
        default:
          break;
      }
    }
    
    if (stack.length > 0) {
      const [stackX, stackY] = stack[stack.length - 1];
      currentPath[2 * stackX + 1][2 * stackY + 1] = 3;
      setCurrentPosition([stackX, stackY]); // Update current position
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
          <input type="range" min="5" max="50" value={tempMazeSize} onChange={(e) => setTempMazeSize(parseInt(e.target.value))}   disabled={isGenerating}  />
          <span>
            {tempMazeSize}x{tempMazeSize}
          </span>
        </div>
        <div>
          <label>Algorithm: </label>
          <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}   disabled={isGenerating} >
            <option value="prim">Prim - In Developmnt</option>
            <option value="recursive">Recursive</option>
            <option value="kruskal">Kruskal - In Developmnt</option>
            <option value="wilson">Wilson - In Developmnt</option>
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
      <div className="animation-controls">
  <button onClick={handlePlay} disabled={isPlaying || (!isPaused && steps.length === 0)}>
    Play
  </button>
  <button onClick={handlePause} disabled={!isPlaying || isPaused}>
    Pause
  </button>
  <button onClick={handleStepForward} disabled={currentStepIndex >= steps.length - 1 || steps.length === 0}>
    Step Forward
  </button>
  <button onClick={handleStepBackward} disabled={currentStepIndex <= 0 || steps.length === 0}>
    Step Backward
  </button>
</div>
<div className="position-display">
  {currentPosition && (
    <div>
      <p>Current Position: x={currentPosition[0]}, y={currentPosition[1]}</p>
    </div>
  )}
</div>

</div>
  );
}

export default App;
