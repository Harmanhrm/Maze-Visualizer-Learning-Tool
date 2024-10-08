import React, { useState, useEffect } from 'react';
import './App.css';
import MazeGenerator from './Components/MazeGenerator';
import MazeControlMenu from './Components/MazeControlMenu';
import MazeContainer from './Components/MazeContainer';
import StepsVisualizer from './Components/StepsVisualizer';

function App() {
  const [mazeSize, setMazeSize] = useState(20);
  const [tempMazeSize, setTempMazeSize] = useState(20);
  const [algorithm, setAlgorithm] = useState('recursive');
  const [visualization, setVisualization] = useState({ maze: [], currentPath: [] });
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSteps, setShowSteps] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(100);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  useEffect(() => {
    let timeoutId;
    const updateStep = () => {
      setCurrentStepIndex(prevIndex => {
        if (prevIndex >= steps.length - 1 || prevIndex < 0) {
          clearTimeout(timeoutId);
          setIsGenerating(false);
          return prevIndex;
        }
        if (!isPaused) {
          timeoutId = setTimeout(updateStep, animationSpeed);
        }
        return prevIndex + 1;
      });
    };

    if (steps.length > 0 && showSteps) {
      if (isPlaying && !isPaused) {
        setIsGenerating(true);
        timeoutId = setTimeout(updateStep, animationSpeed);
      } else if (isPaused || !isPlaying) {
        clearTimeout(timeoutId);
        setIsGenerating(false);
      }
    } else {
      setIsGenerating(false);
      clearTimeout(timeoutId);
    }

    return () => clearTimeout(timeoutId);
  }, [steps, showSteps, animationSpeed, isPlaying, isPaused, currentStepIndex]);

  useEffect(() => {
    if (steps.length > 0 && showSteps) {
      applyStepsToMaze();
    }
  }, [currentStepIndex, steps, showSteps]);

  const handlePlay = () => {
    setIsPaused(false);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStepIndex(prevIndex => Math.min(prevIndex + 1, steps.length - 1));
  };

  const handleStepBackward = () => {
    setIsPaused(true);
    setIsPlaying(false);
    setCurrentStepIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

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
      setCurrentPosition([stackX, stackY]);
    }

    setVisualization({ maze, currentPath });
  };

  const containerSize = Math.min(window.innerWidth, window.innerHeight) * 0.27;
  const cellSize = containerSize / mazeSize;

  return (
    <div className="App">
      <MazeControlMenu
        tempMazeSize={tempMazeSize}
        setTempMazeSize={setTempMazeSize}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        showSteps={showSteps}
        setShowSteps={setShowSteps}
        isGenerating={isGenerating}
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleStepForward={handleStepForward}
        handleStepBackward={handleStepBackward}
        isPlaying={isPlaying}
        isPaused={isPaused}
        steps={steps}
        currentStepIndex={currentStepIndex}
      />
      <MazeGenerator
        setMazeSize={setMazeSize}
        setSteps={setSteps}
        setVisualization={setVisualization}
        setIsGenerating={setIsGenerating}
        setIsPlaying={setIsPlaying}
        setCurrentStepIndex={setCurrentStepIndex}
        algorithm={algorithm}
        tempMazeSize={tempMazeSize}
      />
      <div className={`visualization-container ${isSidebarVisible ? 'shifted' : ''}`}>
        <MazeContainer
          visualization={visualization}
          cellSize={cellSize}
          currentPosition={currentPosition}
        />
      </div>
      <button className="toggle-sidebar" onClick={() => setIsSidebarVisible(!isSidebarVisible)}>
        {isSidebarVisible ? 'Hide Steps' : 'Show Steps'}
      </button>
      <StepsVisualizer
        steps={steps}
        currentStepIndex={currentStepIndex}
        isVisible={isSidebarVisible}
      />
    </div>
  );
}

export default App;