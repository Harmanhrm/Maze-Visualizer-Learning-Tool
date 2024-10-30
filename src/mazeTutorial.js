import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Brain, Play, Book, ArrowRight, Grid } from 'lucide-react';
import MazeVisualizer from './MazeVisualizer';

const TutorialStep = ({ title, description, children }) => (
  <div className="mb-6 p-4 border rounded-lg bg-white shadow-sm">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    {children}
  </div>
);

const MazeTutorialPage = () => {
  const [showMazeVisualizer, setShowMazeVisualizer] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const tutorialSteps = [
    {
      title: "Understanding Recursion",
      content: "Recursion is a programming concept where a function calls itself to solve smaller instances of the same problem. In maze generation, we use recursion to explore and carve paths through the maze.",
      action: "Next: See how it works"
    },
    {
      title: "Maze Generation Algorithm",
      content: "We use a recursive backtracking algorithm. Starting from a point, we: 1) Choose a random direction 2) If we can move that way, carve a path 3) Recursively continue from the new position 4) If stuck, backtrack",
      action: "Next: Watch it in action"
    },
    {
      title: "Visualization Guide",
      content: "Green cells show the current position, light blue shows the backtracking path, and white cells are carved passages. Black cells represent walls.",
      action: "Start Exploring"
    }
  ];

  if (showMazeVisualizer) {
    return (
      <div className="p-4">
        <Button 
          onClick={() => setShowMazeVisualizer(false)}
          className="mb-4"
        >
          ← Back to Menu
        </Button>
        <MazeVisualizer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">Recursive Maze Generator</CardTitle>
            <CardDescription>
              Learn about recursive algorithms through interactive maze generation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                className="p-8 flex flex-col items-center gap-4" 
                onClick={() => setShowTutorial(true)}
              >
                <Book className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Start Tutorial</div>
                  <div className="text-sm">Learn step by step</div>
                </div>
              </Button>

              <Button 
                className="p-8 flex flex-col items-center gap-4"
                variant="outline"
                onClick={() => setShowMazeVisualizer(true)}
              >
                <Play className="w-8 h-8" />
                <div>
                  <div className="font-semibold">Start Exploring</div>
                  <div className="text-sm">Jump right in</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Brain className="w-6 h-6 mb-2" />
              <CardTitle>Learn Recursion</CardTitle>
            </CardHeader>
            <CardContent>
              Understand recursive algorithms through interactive visualization
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Grid className="w-6 h-6 mb-2" />
              <CardTitle>Generate Mazes</CardTitle>
            </CardHeader>
            <CardContent>
              Watch the recursive backtracking algorithm in action
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Play className="w-6 h-6 mb-2" />
              <CardTitle>Interactive Controls</CardTitle>
            </CardHeader>
            <CardContent>
              Control the visualization speed and step through the process
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Learning Recursive Maze Generation</DialogTitle>
            <DialogDescription>
              Step {currentTutorialStep + 1} of {tutorialSteps.length}
            </DialogDescription>
          </DialogHeader>

          <TutorialStep
            title={tutorialSteps[currentTutorialStep].title}
            description={tutorialSteps[currentTutorialStep].content}
          />

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentTutorialStep(Math.max(0, currentTutorialStep - 1))}
              disabled={currentTutorialStep === 0}
            >
              Previous
            </Button>
            
            <Button
              onClick={() => {
                if (currentTutorialStep === tutorialSteps.length - 1) {
                  setShowTutorial(false);
                  setShowMazeVisualizer(true);
                } else {
                  setCurrentTutorialStep(currentTutorialStep + 1);
                }
              }}
            >
              {tutorialSteps[currentTutorialStep].action} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MazeTutorialPage;