// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	const plots: Farm = findPlots(grid);
	return calculateCost(plots);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Grid = string[][];
type Point = { x: number; y: number };
type Farm = Map<string, number>;

interface Plot {
	id: string;
	perimeter: number;
	area: number;
	coords: Set<string>;
}

// Functions
function parseInput(data: string): Grid {
	return data.split("\n").map((row) => [...row]);
}

function findPlots(grid: Grid): Farm {
	const seen: Set<string> = new Set();
	const plotData: Map<string, number> = new Map();

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (seen.has(`${x},${y}`)) {
				continue;
			} else {
				const id = grid[y][x];
				const plot = BFS(id, x, y, grid);

				plotData.set(id, (plotData.get(id) ?? 0) + plot.area * plot.perimeter);

				for (const coord of plot.coords) {
					seen.add(coord);
				}
			}
		}
	}

	return plotData;
}
function BFS(id: string, x: number, y: number, grid: Grid): Plot {
	const plot: Plot = { id, perimeter: 0, area: 0, coords: new Set() };
	const queue: Point[] = [{ x, y }];

	while (queue.length) {
		const current = queue.shift()!;
		const coord = `${current.x},${current.y}`;

		if (plot.coords.has(coord)) {
			continue;
		} else {
			plot.coords.add(coord);
			plot.area++;
		}

		for (const [dx, dy] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1],
		]) {
			const [nx, ny] = [dx + current.x, dy + current.y];

			if (grid[ny] && grid[ny][nx] && grid[ny][nx] === plot.id) {
				queue.push({ x: nx, y: ny });
			} else {
				plot.perimeter++;
			}
		}
	}
	return plot;
}
function calculateCost(farm: Farm): number {
	let totalCost = 0;

	for (const [_, price] of farm) {
		totalCost += price;
	}

	return totalCost;
}
