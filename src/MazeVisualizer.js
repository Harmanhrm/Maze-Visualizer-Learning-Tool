// src/MazeVisualizer.js
import React, { useState } from 'react';
import axios from 'axios';

const MazeVisualizer = () => {
  const [mazeImage, setMazeImage] = useState('');

  const generateMaze = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/generate_maze', {
        algorithm: 'test',
        size: 10,
      });
      setMazeImage(response.data.result);
    } catch (error) {
      console.error('Error generating maze:', error);
    }
  };

  return (
    <div>
      <h1>Maze Visualizer</h1>
      <button onClick={generateMaze}>Generate Maze</button>
      {mazeImage && <img src={mazeImage} alt="Generated Maze" />}
    </div>
  );
};

export default MazeVisualizer;
