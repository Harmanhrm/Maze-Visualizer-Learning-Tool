class Prim {
  constructor(size) {
    this.H = size;
    this.W = size;
  }

  generate() {
    const grid = Array.from({ length: this.H }, () => Array(this.W).fill(1));
    const currentRow = 1;
    const currentCol = 1;
    grid[currentRow][currentCol] = 0;

    let neighbors = this.findNeighbors(currentRow, currentCol, grid, true);

    while (neighbors.length) {
      const nn = Math.floor(Math.random() * neighbors.length);
      const [currentRow, currentCol] = neighbors.splice(nn, 1)[0];

      if (grid[currentRow][currentCol] === 0) continue;

      const nearestNeighbors = this.findNearestNeighbors(currentRow, currentCol, grid);
      const [nearestN0, nearestN1] = nearestNeighbors[Math.floor(Math.random() * nearestNeighbors.length)];
      grid[currentRow][currentCol] = 0;

      let midRow, midCol;
      if (currentRow === nearestN0) {
        midCol = Math.floor((currentCol + nearestN1) / 2);
        grid[currentRow][midCol] = 0;
      } else if (currentCol === nearestN1) {
        midRow = Math.floor((currentRow + nearestN0) / 2);
        grid[midRow][currentCol] = 0;
      }

      neighbors = neighbors.concat(this.findNeighbors(currentRow, currentCol, grid, true));
      neighbors.sort(() => Math.random() - 0.5);
    }

    // Ensure boundaries remain walls after generation
    for (let i = 0; i < this.W; i++) {
      grid[0][i] = 1;
      grid[this.H - 1][i] = 1;
    }
    for (let i = 0; i < this.H; i++) {
      grid[i][0] = 1;
      grid[i][this.W - 1] = 1;
    }

    return grid;
  }

  findNeighbors(row, col, grid, unvisited = false) {
    const neighbors = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // Single steps
      [-2, 0], [2, 0], [0, -2], [0, 2], // Double steps
    ];

    for (const [dRow, dCol] of directions) {
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (1 <= nRow && nRow < this.H - 1 && 1 <= nCol && nCol < this.W - 1) {
        if (unvisited) {
          if (grid[nRow][nCol] === 1) neighbors.push([nRow, nCol]);
        } else {
          if (grid[nRow][nCol] === 0) neighbors.push([nRow, nCol]);
        }
      }
    }
    return neighbors;
  }

  findNearestNeighbors(row, col, grid) {
    const neighbors = [];
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1], // Single steps
    ];

    for (const [dRow, dCol] of directions) {
      const nRow = row + dRow;
      const nCol = col + dCol;
      if (1 <= nRow && nRow < this.H - 1 && 1 <= nCol && nCol < this.W - 1) {
        if (grid[nRow][nCol] === 0) neighbors.push([nRow, nCol]);
      }
    }
    return neighbors;
  }
}

export default Prim;
