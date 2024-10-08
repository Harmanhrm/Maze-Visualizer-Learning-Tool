import React from 'react';

const StepControls = ({ handlePlay, handlePause, handleStepForward, handleStepBackward, isPlaying, isPaused, steps, currentStepIndex }) => {
  return (
    <div className="animation-controls">
      <button onClick={handlePlay} disabled={isPlaying || (!isPaused && steps.length === 0)}>Play</button>
      <button onClick={handlePause} disabled={!isPlaying || isPaused}>Pause</button>
      <button onClick={handleStepForward} disabled={currentStepIndex >= steps.length - 1 || steps.length === 0}>Step Forward</button>
      <button onClick={handleStepBackward} disabled={currentStepIndex <= 0 || steps.length === 0}>Step Backward</button>
    </div>
  );
};

export default StepControls;