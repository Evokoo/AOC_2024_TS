// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return pricePlots(grid);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return pricePlots(grid, true);
}

type Grid = string[][];
type Point = { x: number; y: number };

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
function pricePlots(grid: Grid, sides: boolean = false): number {
	const seen: Set<string> = new Set();
	let plotCost: number = 0;

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (seen.has(`${x},${y}`)) {
				continue;
			} else {
				const id = grid[y][x];
				const plot = BFS(id, x, y, grid);

				if (sides) {
					plotCost += plot.area * sideCount(plot);
				} else {
					plotCost += plot.area * plot.perimeter;
				}

				for (const coord of plot.coords) {
					seen.add(coord);
				}
			}
		}
	}

	return plotCost;
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
function sideCount(plot: Plot): number {
	const max: Point = { x: -Infinity, y: -Infinity };
	const min: Point = { x: Infinity, y: Infinity };

	[...plot.coords].forEach((coord) => {
		const [x, y] = coord.split(",").map(Number);
		max.x = Math.max(x, max.x);
		max.y = Math.max(y, max.y);
		min.x = Math.min(x, min.x);
		min.y = Math.min(y, min.y);
	});

	let sides = 0;

	//Horiztonal
	for (let y = min.y; y <= max.y; y++) {
		for (let x = min.x; x <= max.x; x++) {
			const coord = `${x},${y}`;

			if (!plot.coords.has(coord)) {
				continue;
			} else {
				const isShape: Record<string, boolean> = {
					N: false,
					S: false,
					E: false,
					W: false,
					NE: false,
					NW: false,
					SE: false,
					SW: false,
				};

				for (const { direction, move } of [
					{ direction: "N", move: { x: 0, y: -1 } },
					{ direction: "S", move: { x: 0, y: 1 } },
					{ direction: "E", move: { x: 1, y: 0 } },
					{ direction: "W", move: { x: -1, y: 0 } },
					{ direction: "NE", move: { x: 1, y: -1 } },
					{ direction: "SE", move: { x: 1, y: 1 } },
					{ direction: "NW", move: { x: -1, y: -1 } },
					{ direction: "SW", move: { x: -1, y: 1 } },
				]) {
					if (plot.coords.has(`${x + move.x},${y + move.y}`)) {
						isShape[direction] = true;
					}
				}

				//Top Right Corner
				if (!isShape.N && !isShape.W) sides++;
				//Top Left Corner
				if (!isShape.N && !isShape.E) sides++;
				//Bottom Right Corner
				if (!isShape.S && !isShape.W) sides++;
				//Bottom Left Corner
				if (!isShape.S && !isShape.E) sides++;

				//Inner Top Left
				if (isShape.E && isShape.S && !isShape.SE) sides++;
				//Inner Top Right
				if (isShape.W && isShape.S && !isShape.SW) sides++;
				//Inner Bottom Left
				if (isShape.N && isShape.E && !isShape.NE) sides++;
				//Inner Bottom Right
				if (isShape.N && isShape.W && !isShape.NW) sides++;
			}
		}
	}
	return sides;
}
