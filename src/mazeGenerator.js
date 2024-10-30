export const generateMazeSteps = (size = 15) => {
    const maze = Array(size).fill().map(() => Array(size).fill(1));
    const currentPath = Array(size).fill().map(() => Array(size).fill(0));
    const steps = [];
  
    let startX = 1, startY = 1;
    maze[startX][startY] = 0;
    currentPath[startX][startY] = 2;
  
    steps.push({
      maze: JSON.parse(JSON.stringify(maze)),
      currentPath: JSON.parse(JSON.stringify(currentPath)),
      stack: [[startX, startY]]
    });
  
    const stack = [[startX, startY]];
    const visited = new Set([`${startX},${startY}`]);
  
    while (stack.length > 0) {
      const [currentX, currentY] = stack[stack.length - 1];
      const directions = [
        [0, 2], [2, 0], [0, -2], [-2, 0]
      ].sort(() => Math.random() - 0.5);
  
      let moved = false;
  
      for (const [dx, dy] of directions) {
        const newX = currentX + dx;
        const newY = currentY + dy;
  
        if (
          newX > 0 && newX < size - 1 && 
          newY > 0 && newY < size - 1 && 
          !visited.has(`${newX},${newY}`)
        ) {
          maze[newX][newY] = 0;
          maze[currentX + dx/2][currentY + dy/2] = 0;
          currentPath[newX][newY] = 2;
          
          stack.push([newX, newY]);
          visited.add(`${newX},${newY}`);
          moved = true;
  
          steps.push({
            maze: JSON.parse(JSON.stringify(maze)),
            currentPath: JSON.parse(JSON.stringify(currentPath)),
            stack: [...stack]
          });
          break;
        }
      }
  
      if (!moved) {
        currentPath[currentX][currentY] = 1;
        stack.pop();
        steps.push({
          maze: JSON.parse(JSON.stringify(maze)),
          currentPath: JSON.parse(JSON.stringify(currentPath)),
          stack: [...stack]
        });
      }
    }
  
    return steps;
  };