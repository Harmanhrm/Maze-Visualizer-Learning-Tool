export const generateMazeSteps = (size = 15) => {
    
    const maze = Array(size).fill().map(() => Array(size).fill(1));
    const currentPath = Array(size).fill().map(() => Array(size).fill(0));
    const steps = [];
    
    
    const unvisited = new Set();
    for (let i = 1; i < size - 1; i += 2) {
      for (let j = 1; j < size - 1; j += 2) {
        unvisited.add(`${i},${j}`);
      }
    }
    
    
    const startX = 1;
    const startY = 1;
    maze[startX][startY] = 0;
    currentPath[startX][startY] = 2;
    unvisited.delete(`${startX},${startY}`);
    
    
    const walls = [];
    addWalls(startX, startY, walls);
    
    steps.push({
      maze: JSON.parse(JSON.stringify(maze)),
      currentPath: JSON.parse(JSON.stringify(currentPath)),
      frontierCells: [...walls]
    });
    
    
    while (walls.length > 0) {
      
      const wallIndex = Math.floor(Math.random() * walls.length);
      const [wallX, wallY, direction] = walls[wallIndex];
      walls.splice(wallIndex, 1);
      
      const [dx, dy] = direction;
      const nextX = wallX + dx;
      const nextY = wallY + dy;
      
      
      if (unvisited.has(`${nextX},${nextY}`)) {
        
        maze[wallX][wallY] = 0;
        maze[nextX][nextY] = 0;
        currentPath[nextX][nextY] = 2;
        
        
        unvisited.delete(`${nextX},${nextY}`);
        
        
        addWalls(nextX, nextY, walls);
        
        steps.push({
          maze: JSON.parse(JSON.stringify(maze)),
          currentPath: JSON.parse(JSON.stringify(currentPath)),
          frontierCells: [...walls]
        });
      }
      
      
      currentPath[wallX][wallY] = 1;
      currentPath[nextX][nextY] = 1;
    }
    
    return steps;
  };
  
  
  function addWalls(x, y, walls) {
    const directions = [
      [-2, 0, [-1, 0]], 
      [2, 0, [1, 0]],   
      [0, -2, [0, -1]], 
      [0, 2, [0, 1]]    
    ];
    
    for (const [dx, dy, direction] of directions) {
      const newX = x + dx;
      const newY = y + dy;
      const wallX = x + direction[0];
      const wallY = y + direction[1];
      
      if (
        newX > 0 && newX < maze.length - 1 &&
        newY > 0 && newY < maze.length - 1
      ) {
        walls.push([wallX, wallY, direction]);
      }
    }
  }