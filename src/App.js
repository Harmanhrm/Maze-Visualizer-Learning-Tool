import React, { useState } from 'react';
import MazeVisualizer from './MazeVisualizer';
import { Play, Book, X, ChevronRight, ChevronLeft } from 'lucide-react';
import './App.css';

const App = () => {
  const [showTutorial, setShowTutorial] = useState(true); 
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to Maze Generator!",
      content: "This interactive visualization shows how mazes are created using recursive backtracking. Let's learn how it works!",
    },
    {
      title: "Understanding the Colors",
      content: "🟢 Green: Current position\n🔷 Light Blue: Backtracking path\n⬛ Black: Walls\n⬜ White: Open passages",
    },
    {
      title: "How It Works",
      content: "1. Start at a cell\n2. Randomly choose a direction\n3. Break the wall if possible\n4. Repeat until no moves are left\n5. Backtrack and try new paths",
    },
    {
      title: "Controls",
      content: "▶️ Play/Pause: Start or stop the animation\n⏮️ Reset: Start over\n⏭️ Step Forward: Move one step\n🎚️ Speed: Adjust animation speed",
    }
  ];

  return (
    <div className="maze-app">
      <div className="container">
        <header className="header">
          <h1 className="title">Recursive Maze Generator</h1>
          <p>Watch the magic of recursive algorithms in action!</p>
          <button className="button" onClick={() => setShowTutorial(true)}>
            <Book className="w-5 h-5" />
            <span className="ml-2">Tutorial</span>
          </button>
        </header>

        <main className="maze-container">
          <MazeVisualizer />
        </main>
      </div>

      {/* Tutorial Popup */}
      {showTutorial && (
        <div className="tutorial-overlay">
          <div className="tutorial-modal">
            <button 
              className="close-button"
              onClick={() => setShowTutorial(false)}
            >
              <X className="w-6 h-6" />
            </button>

            <div className="tutorial-content">
              <h2 className="text-2xl font-bold mb-4">
                {tutorialSteps[currentTutorialStep].title}
              </h2>
              <p className="whitespace-pre-line text-gray-300">
                {tutorialSteps[currentTutorialStep].content}
              </p>
            </div>

            <div className="progress-dots">
              {tutorialSteps.map((_, index) => (
                <div 
                  key={index} 
                  className={`dot ${index === currentTutorialStep ? 'active' : ''}`}
                />
              ))}
            </div>

            <div className="controls">
              <button
                className="button secondary"
                onClick={() => setCurrentTutorialStep(step => Math.max(0, step - 1))}
                disabled={currentTutorialStep === 0}
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2">Previous</span>
              </button>
              
              <button
                className="button"
                onClick={() => {
                  if (currentTutorialStep === tutorialSteps.length - 1) {
                    setShowTutorial(false);
                    setCurrentTutorialStep(0);
                  } else {
                    setCurrentTutorialStep(step => step + 1);
                  }
                }}
              >
                <span className="mr-2">
                  {currentTutorialStep === tutorialSteps.length - 1 ? 'Start Exploring' : 'Next'}
                </span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;