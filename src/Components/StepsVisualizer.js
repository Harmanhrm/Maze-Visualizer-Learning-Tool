import React from 'react';
import './StepsVisualizer.css';

const StepsVisualizer = ({ steps, currentStepIndex, isVisible }) => {
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
    <div className={`steps-container ${isVisible ? 'visible' : 'hidden'}`}>
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
  );
};

export default StepsVisualizer;