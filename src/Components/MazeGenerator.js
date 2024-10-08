import React, { useState } from 'react';

const MazeGenerator = ({ setMazeSize, setSteps, setVisualization, setIsGenerating, setIsPlaying, algorithm, tempMazeSize }) => {
  const handleGenerateMaze = async () => {
    setMazeSize(tempMazeSize);
    setIsPlaying(true);

    try {
      const response = await fetch(`https://Harmanhrm.pythonanywhere.com/generate_maze?size=${tempMazeSize}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const { maze, steps } = await response.json();
      setVisualization({
        maze,
        currentPath: Array(maze.length).fill(null).map(() => Array(maze[0].length).fill(0)),
      });
      setSteps(steps);
      setIsGenerating(true);
      setIsPlaying(false);
    } catch (error) {
      console.error('Error fetching maze:', error);
    }
  };

  return (
    <button onClick={handleGenerateMaze}>Generate Maze</button>
  );
};

export default MazeGenerator;