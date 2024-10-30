import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { generateMazeSteps } from './mazeGenerator';
import GraphVisualizer from './GraphVisualizer';
import CodeTutorial from './CodeTutorial';
const MazeVisualizer = () => {
  const [maze, setMaze] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [generationSteps, setGenerationSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(100);
  const cellSize = 30;

  const generateMaze = () => {
    const steps = generateMazeSteps(15);
    setGenerationSteps(steps);
    setCurrentStep(0);
    setMaze(steps[0].maze);
    setCurrentPath(steps[0].currentPath);
    setIsPlaying(false);
  };

  const playStep = useCallback(() => {
    if (currentStep < generationSteps.length - 1) {
      setCurrentStep(step => step + 1);
      setMaze(generationSteps[currentStep + 1].maze);
      setCurrentPath(generationSteps[currentStep + 1].currentPath);
    } else {
      setIsPlaying(false);
    }
  }, [currentStep, generationSteps]);

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(playStep, speed);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, playStep, speed]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setMaze(generationSteps[0].maze);
    setCurrentPath(generationSteps[0].currentPath);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < generationSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setMaze(generationSteps[currentStep + 1].maze);
      setCurrentPath(generationSteps[currentStep + 1].currentPath);
    }
  };

  return (
    <div className="p-8">
      <div className="flex flex-col gap-4">
        <button 
          onClick={generateMaze}
          className="w-48 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Generate New Maze
        </button>

        {generationSteps.length > 0 && (
          <div className="control-panel flex items-center gap-4">
            <button
              onClick={handleReset}
              className="p-2 rounded hover:bg-gray-200"
              disabled={!generationSteps.length}
            >
              <SkipBack className="w-6 h-6" />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="p-2 rounded hover:bg-gray-200"
              disabled={!generationSteps.length}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>
            
            <button
              onClick={handleStepForward}
              className="p-2 rounded hover:bg-gray-200"
              disabled={!generationSteps.length || currentStep >= generationSteps.length - 1}
            >
              <SkipForward className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-sm">Speed:</span>
              <input
                type="range"
                min="50"
                max="500"
                value={speed}
                onChange={(e) => setSpeed(e.target.value)}
                className="w-32"
              />
              <span className="text-sm">{speed}ms</span>
            </div>

            <div className="text-sm">
              Step: {currentStep + 1} / {generationSteps.length}
            </div>
          </div>
        )}

        <div className="visualization border-2 border-gray-300 inline-block p-2 bg-gray-100">
          {maze.length > 0 ? (
            <div>
              {maze.map((row, rowIndex) => (
                <div 
                  key={rowIndex} 
                  style={{ display: 'flex', height: `${cellSize}px` }}
                >
                  {row.map((cell, cellIndex) => (
                    <div
                      key={`${rowIndex}-${cellIndex}`}
                      style={{
                        width: `${cellSize}px`,
                        height: `${cellSize}px`,
                        backgroundColor: cell === 1 ? '#1a1a1a' : 
                                       currentPath[rowIndex][cellIndex] === 2 ? '#4CAF50' :
                                       currentPath[rowIndex][cellIndex] === 1 ? '#87CEEB' : 
                                       'white',
                        transition: 'background-color 0.2s',
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 p-4">
              Click "Generate New Maze" to start
            </div>
          )}
           <GraphVisualizer 
      generationSteps={generationSteps}
      currentStep={currentStep}
    />
    
        </div>
        {maze.length > 0 && (
  <CodeTutorial 
    currentStep={currentStep}
    generationSteps={generationSteps}
  />
)}
      </div>
    </div>
  );
};

export default MazeVisualizer;