// mazeGenerator.js
export const generateMaze = async (size) => {
  console.log(`Generating maze with size: ${size}`);

  const pythonCode = `
import numpy as np
import random

class BacktrackingGenerator:
    def __init__(self, dim):
        self.dim = dim
        self.steps = []  # Initialize steps attribute here
        self.grid = self.initialize_maze(dim)

    def initialize_maze(self, dim):
        # Step 1: Create a grid filled with walls (1s)
        self.steps.append((0, "Initialize maze with walls", None))
        return np.ones((dim*2+1, dim*2+1), dtype=int)

    def generate_maze(self):
        # Step 2: Define the starting point
        x, y = 0, 0
        self.grid[2*x+1, 2*y+1] = 0
        self.steps.append((1, "Mark the start cell as a path", (x, y)))

        # Step 3: Initialize the stack with the starting point
        stack = [(x, y)]
        self.steps.append((2, "Initialize stack with the start position", (x, y)))

        while stack:
            self.steps.append((3, "While Stack is not empty", None))
            # Step 4: Get the current position from the stack
            x, y = stack[-1]
            self.steps.append((4, "Get current position from stack", (x, y)))

            # Step 5: Shuffle directions
            directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
            random.shuffle(directions)
            self.steps.append((5, "Shuffle directions", None))

            moved = False
            for dx, dy in directions:
                self.steps.append((6, "For each direction, confirm valididity", (dx, dy)))
                # Step 6: Calculate the new position
                nx, ny = x + dx, y + dy
                self.steps.append((7, "Calculate new position", (nx, ny)))

                # Step 7: If the new position is within bounds and is a wall
                if 0 <= nx < self.dim and 0 <= ny < self.dim and self.grid[2*nx+1, 2*ny+1] == 1:
                    self.steps.append((8, "Check if postion is within bounds and not a wall", (nx, ny)))
                    # Step 9: Mark the new position as a path
                    self.grid[2*nx+1, 2*ny+1] = 0
                    self.grid[2*x+1+dx, 2*y+1+dy] = 0
                    self.steps.append((9, "Mark new position and path between positions", (nx, ny)))

                    # Step 10: Add the new position to the stack
                    stack.append((nx, ny))
                    self.steps.append((10, "Add new position to stack", (nx, ny)))

                    moved = True
                    break

            # Step 11: If no move is possible, backtrack
            if not moved:
                self.steps.append((11, "Backtrack, pop stack", None))
                stack.pop()

        # Step 11: Maze generation complete
        self.steps.append((12, "Maze generation complete", None))
        print("Maze generation complete")

generator = BacktrackingGenerator(${size})
generator.generate_maze()
maze = generator.grid.tolist()
steps = generator.steps
maze, steps
  `;

  try {
    const pyodide = await window.loadPyodide();
    await pyodide.loadPackage('numpy');
    const [maze, steps] = await pyodide.runPythonAsync(pythonCode);
    console.log('Maze generated', maze, steps);
    return { maze, steps };
  } catch (error) {
    console.error('Error generating maze:', error);
    throw error;
  }
};