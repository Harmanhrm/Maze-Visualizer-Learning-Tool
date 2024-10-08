import React from 'react';
import ControlPanel from './ControlPanel';
import StepControls from './StepControl';

const MazeControlMenu = ({
  tempMazeSize,
  setTempMazeSize,
  algorithm,
  setAlgorithm,
  showSteps,
  setShowSteps,
  isGenerating,
  handlePlay,
  handlePause,
  handleStepForward,
  handleStepBackward,
  isPlaying,
  isPaused,
  steps,
  currentStepIndex
}) => {
  return (
    <div className="maze-control-menu">
      <ControlPanel
        tempMazeSize={tempMazeSize}
        setTempMazeSize={setTempMazeSize}
        algorithm={algorithm}
        setAlgorithm={setAlgorithm}
        showSteps={showSteps}
        setShowSteps={setShowSteps}
        isGenerating={isGenerating}
      />
      <StepControls
        handlePlay={handlePlay}
        handlePause={handlePause}
        handleStepForward={handleStepForward}
        handleStepBackward={handleStepBackward}
        isPlaying={isPlaying}
        isPaused={isPaused}
        steps={steps}
        currentStepIndex={currentStepIndex}
      />
    </div>
  );
};

export default MazeControlMenu;