import random

class BacktrackingGenerator:
    def __init__(self, size):
        self.size = size
        self.grid = self.initialize_maze(size)

    def initialize_maze(self, size):
        return [[1] * size for _ in range(size)]  # 1 represents a wall

    def is_valid_move(self, x, y):
        if x < 1 or x >= self.size - 1 or y < 1 or y >= self.size - 1:
            return False

        passages = 0
        if self.grid[x - 1][y] == 0: passages += 1
        if self.grid[x + 1][y] == 0: passages += 1
        if self.grid[x][y - 1] == 0: passages += 1
        if self.grid[x][y + 1] == 0: passages += 1

        return passages <= 1

    def generate_maze(self):
        stack = []
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # right, down, left, up

        # Starting point
        start_x, start_y = 1, 1
        self.grid[start_x][start_y] = 0
        stack.append((start_x, start_y))

        while stack:
            x, y = stack[-1]
            stack.pop()

            # Shuffle directions
            random.shuffle(directions)

            moved = False
            for dx, dy in directions:
                nx, ny = x + dx * 2, y + dy * 2

                if self.is_valid_move(nx, ny):
                    self.grid[x + dx][y + dy] = 0
                    self.grid[nx][ny] = 0
                    stack.append((nx, ny))
                    moved = True
                    break

            if not moved:
                stack.append((x, y))

    def display_maze(self):
        for row in self.grid:
            print(''.join('#' if cell == 1 else ' ' for cell in row))

# Usage
maze_size = 11  # Should be an odd number
generator = BacktrackingGenerator(maze_size)
generator.generate_maze()
generator.display_maze()
