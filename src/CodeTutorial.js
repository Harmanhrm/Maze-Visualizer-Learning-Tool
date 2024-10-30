import React, { useState } from 'react';
import { Code, ChevronRight, ChevronLeft, Play } from 'lucide-react';
import './CodeTutorial.css';

const CodeTutorial = ({ currentStep, generationSteps }) => {
  const [selectedSection, setSelectedSection] = useState(0);

  const codeSteps = [
    {
      title: "Initialization",
      code: `function generateMaze(size = 15) {
  // Initialize maze with walls
  const maze = Array(size).fill().map(() => Array(size).fill(1));
  const currentPath = Array(size).fill().map(() => Array(size).fill(0));
  
  // Start position at (1,1)
  let startX = 1, startY = 1;
  maze[startX][startY] = 0;        // Clear starting cell
  currentPath[startX][startY] = 2;  // Mark as current position`,
      explanation: "First, we create a grid filled with walls (1's) and initialize our path tracker. We start at position (1,1) to ensure we have walls around the edges."
    },
    {
      title: "Stack Setup",
      code: `  // Initialize tracking variables
  const stack = [[startX, startY]];
  const visited = new Set([\`\${startX},\${startY}\`]);
  
  steps.push({
    maze: JSON.parse(JSON.stringify(maze)),
    currentPath: JSON.parse(JSON.stringify(currentPath)),
    stack: [...stack]
  });`,
      explanation: "We use a stack to keep track of our path and a Set to remember visited cells. Each step of the generation is recorded for visualization."
    },
    {
      title: "Direction Selection",
      code: `  // Get random directions
  const directions = [
    [0, 2],   // Right
    [2, 0],   // Down
    [0, -2],  // Left
    [-2, 0]   // Up
  ].sort(() => Math.random() - 0.5);
  
  // Try each direction
  for (const [dx, dy] of directions) {
    const newX = currentX + dx;
    const newY = currentY + dy;`,
      explanation: "We randomly shuffle possible directions (right, down, left, up) and try each one. We move two cells at a time to maintain walls between passages."
    },
    {
      title: "Wall Breaking",
      code: `  // Check if move is valid
  if (newX > 0 && newX < size - 1 && 
      newY > 0 && newY < size - 1 && 
      !visited.has(\`\${newX},\${newY}\`)) {
    
    // Break wall between cells
    maze[newX][newY] = 0;
    maze[currentX + dx/2][currentY + dy/2] = 0;
    currentPath[newX][newY] = 2;`,
      explanation: "When we find a valid move, we 'break' the wall by setting cells to 0, including the cell between our current position and the new position."
    },
    {
      title: "Backtracking",
      code: `  // If no valid moves
  if (!moved) {
    currentPath[currentX][currentY] = 1;  // Mark as backtracked
    stack.pop();  // Go back one step
    
    steps.push({
      maze: JSON.parse(JSON.stringify(maze)),
      currentPath: JSON.parse(JSON.stringify(currentPath)),
      stack: [...stack]
    });
  }`,
      explanation: "When we can't move in any direction, we backtrack by popping from our stack and marking our path in blue to show where we've backtracked."
    }
  ];

  const currentSection = codeSteps[selectedSection];

  return (
    <div className="code-tutorial">
      <div className="code-tutorial-header">
        <h2>Code Walkthrough</h2>
        <div className="section-navigation">
          <button 
            className="nav-button"
            onClick={() => setSelectedSection(s => Math.max(0, s - 1))}
            disabled={selectedSection === 0}
          >
            <ChevronLeft />
          </button>
          <span className="section-title">{currentSection.title}</span>
          <button 
            className="nav-button"
            onClick={() => setSelectedSection(s => Math.min(codeSteps.length - 1, s + 1))}
            disabled={selectedSection === codeSteps.length - 1}
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="code-content">
        <div className="code-section">
          <div className="code-header">
            <Code size={16} />
            <span>Code</span>
          </div>
          <pre>
            <code>{currentSection.code}</code>
          </pre>
        </div>

        <div className="explanation-section">
          <div className="explanation-header">
            <Play size={16} />
            <span>Explanation</span>
          </div>
          <p>{currentSection.explanation}</p>
        </div>
      </div>

      <div className="section-dots">
        {codeSteps.map((_, index) => (
          <div 
            key={index}
            className={`dot ${index === selectedSection ? 'active' : ''}`}
            onClick={() => setSelectedSection(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CodeTutorial;