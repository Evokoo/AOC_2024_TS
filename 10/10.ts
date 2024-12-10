// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return findTrailHeads(grid);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Path = { x: number; y: number; elevation: number };
type Grid = number[][];

// Functions
function parseInput(data: string): Grid {
	return data.split("\n").map((row) => [...row].map(Number));
}
function findTrailHeads(grid: Grid): number {
	let trailHeadCount = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === 0) {
				trailHeadCount += traverseGrid(x, y, grid);
			}
		}
	}

	return trailHeadCount;
}
function traverseGrid(x: number, y: number, grid: Grid): number {
	const queue: Path[] = [{ x, y, elevation: 0 }];
	const seen: Set<string> = new Set();
	let trailHeadCount = 0;

	while (queue.length) {
		const current = queue.pop()!;
		const coord = `${current.x},${current.y}`;

		if (seen.has(coord)) {
			continue;
		} else {
			seen.add(coord);
		}

		if (current.elevation === 9) {
			trailHeadCount++;
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

	return trailHeadCount;
}
