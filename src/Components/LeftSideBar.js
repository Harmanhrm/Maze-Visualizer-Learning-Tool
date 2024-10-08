import React from 'react';
import './LeftSideBar.css';
const LeftSidebar = ({ algorithm, isVisible }) => {
  const getAlgorithmInfo = () => {
    switch (algorithm) {
      case 'recursive':
        return (
          <div>
            <h3>Recursive Algorithm</h3>
            <p>The recursive algorithm is a depth-first search algorithm...</p>
          </div>
        );
      // Add more cases for other algorithms
      default:
        return <p>No information available for this algorithm.</p>;
    }
  };

  return (
    <div className={`left-sidebar ${isVisible ? 'visible' : 'hidden'}`}>
      {getAlgorithmInfo()}
    </div>
  );
};

export default LeftSidebar;