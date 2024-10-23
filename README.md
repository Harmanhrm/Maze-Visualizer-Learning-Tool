# Maze Visualizer Learning Tool

This is a **React.js** project that visualizes the maze generation process, designed for learning and educational purposes. It demonstrates how different maze generation algorithms (like Recursive Backtracking) work step by step, with an option to pause, play, and step through the algorithm visually. This project was developed as part of my journey as a Computer Science student.

## Features

- **Maze Generation Algorithms**: Visualizes the step-by-step process of maze generation using different algorithms (currently Recursive Backtracking).
- **Interactive Controls**: Allows users to control the speed of the visualization, pause and play the generation, and manually step forward or backward through the steps.
- **Customizable Maze Size**: Users can adjust the size of the maze dynamically before starting the generation process.
- **Path Visualization**: Highlights the current path being explored by the maze generation algorithm.
- **Step-by-Step Learning**: Each step in the algorithm can be visualized, helping users understand the logic behind the maze generation.

## How It Works

The app is composed of several key components:

1. **MazeControlMenu**: Provides controls to start, pause, or step through the maze generation process. Users can also change the algorithm and maze size.
2. **MazeGenerator**: Manages the maze generation logic and updates the steps to be visualized.
3. **MazeContainer**: Displays the current state of the maze and the path being generated.
4. **StepsVisualizer**: Shows a list of steps in the generation process, updating dynamically as the maze is being built.
5. **LeftSidebar & RightSidebar**: Additional information and controls for the user to interact with, including algorithm descriptions and step-by-step breakdowns.

## Key State Variables

- `mazeSize` and `tempMazeSize`: Controls the size of the maze grid.
- `algorithm`: Determines which maze generation algorithm is used.
- `visualization`: Tracks the maze and the current path being visualized.
- `steps`: Stores the steps of the maze generation process.
- `currentStepIndex`: Tracks the current step in the visualization.
- `isPlaying` and `isPaused`: Control whether the maze generation is running or paused.

## Installation and Usage

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-repo/maze-visualizer.git
   cd maze-visualizer
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm start
   ```

   The app will be accessible at `http://localhost:3000`.

4. **Interact with the app**: Use the control menu to adjust maze size, play the visualization, or step through the algorithm.

## Future Improvements

- **Support for More Algorithms**: Add additional maze generation algorithms like Prim's or Kruskal's algorithm.
- **Save and Load Feature**: Enable users to save and load different mazes.
- **Mobile Compatibility**: Make the interface responsive and optimized for mobile users.
  
## Technologies Used

- **React.js** for building the user interface.
- **CSS** for styling the application.

This project is a continuous learning tool, and I plan to improve and expand its features as I further my understanding of algorithms and data structures. Feedback and contributions are welcome!

---

Feel free to reach out if you have any questions or suggestions!
