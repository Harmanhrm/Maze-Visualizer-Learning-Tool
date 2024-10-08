import React from 'react';

const MazeGenerator = ({ setMazeSize, setSteps, setVisualization, setIsGenerating, setIsPlaying, setCurrentStepIndex, algorithm, tempMazeSize }) => {
  const handleGenerateMaze = async () => {
    // Clear current visualization and steps
    setVisualization({ maze: [], currentPath: [] });
    setSteps([]);
    setCurrentStepIndex(0); // Reset step count
    setIsPlaying(false);
    setIsGenerating(false);

    // Set new maze size and start generation
    setMazeSize(tempMazeSize);
    setIsPlaying(true);

    try {
      const response = await fetch(`https://Harmanhrm.pythonanywhere.com/generate_maze?size=${tempMazeSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { maze, steps } = await response.json();

      // Check if the response contains valid maze and steps data
      if (!maze || !steps || !Array.isArray(maze) || !Array.isArray(steps)) {
        throw new Error('Invalid maze data received');
      }

      setVisualization({
        maze,
        currentPath: Array(maze.length).fill(null).map(() => Array(maze[0].length).fill(0)),
      });
      setSteps(steps);
      setIsGenerating(true);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error fetching maze:', error);
      setIsGenerating(false);
      setIsPlaying(false);
    }
  };

  return (
    <button onClick={handleGenerateMaze}>Generate Maze</button>
  );
};

export default MazeGenerator;