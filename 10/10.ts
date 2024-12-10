// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return assessTrail(grid);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return assessTrail(grid, true);
}

type Path = { x: number; y: number; elevation: number };
type Grid = number[][];

// Functions
function parseInput(data: string): Grid {
	return data.split("\n").map((row) => [...row].map(Number));
}
function assessTrail(grid: Grid, unique: boolean = false): number {
	let result: number = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === 0) {
				result += traverseGrid(x, y, grid, unique);
			}
		}
	}
	return result;
}
//DFS
function traverseGrid(
	x: number,
	y: number,
	grid: Grid,
	unqiue: boolean
): number {
	const queue: Path[] = [{ x, y, elevation: 0 }];
	const seen: Set<string> = new Set();
	let result = 0;

	while (queue.length) {
		const current = queue.pop()!;

		if (!unqiue) {
			const coord = `${current.x},${current.y}`;

			if (seen.has(coord)) {
				continue;
			} else {
				seen.add(coord);
			}
		}

		if (current.elevation === 9) {
			result++;
			continue;
		} else {
			for (const [dx, dy] of [
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1],
			]) {
				const [nx, ny] = [current.x + dx, current.y + dy];

				if (
					grid[ny] &&
					grid[ny][nx] &&
					grid[ny][nx] === current.elevation + 1
				) {
					queue.push({ x: nx, y: ny, elevation: current.elevation + 1 });
				}
			}
		}
	}

	return result;
}
