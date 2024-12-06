// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const labDetails: Lab = parseInput(data);
	return getGuardPath(labDetails).size;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const labDetails: Lab = parseInput(data);
	const infiniteLoops: number = alterGuardPath(
		parseInput(data),
		getGuardPath(labDetails)
	);

	return infiniteLoops;
}

//Types and Interface
type Grid = string[][];

interface Guard {
	x: number;
	y: number;
	path: Set<string>;
	bearing: number;
}
interface Lab {
	grid: Grid;
	guard: Guard;
}

// Functions
function parseCoordinate(x: number, y: number): string {
	return `${x},${y}`;
}
function parseInput(input: string): Lab {
	const grid: Grid = input.split("\n").map((row) => [...row]);

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			if (grid[y][x] === "^") {
				const guard = {
					x,
					y,
					path: new Set([parseCoordinate(x, y)]),
					bearing: 0,
				};
				return { grid, guard };
			}
		}
	}

	throw Error("Guard not found!");
}
function getGuardPath({ grid, guard }: Lab): Set<string> {
	const turns: Map<string, number> = new Map();

	while (true) {
		const nextCoord = { x: guard.x, y: guard.y };

		switch (guard.bearing) {
			case 0:
				nextCoord.y--;
				break;
			case 90:
				nextCoord.x++;
				break;
			case 180:
				nextCoord.y++;
				break;
			case 270:
				nextCoord.x--;
				break;
		}

		if (grid[nextCoord.y] && grid[nextCoord.y][nextCoord.x]) {
			const coord = parseCoordinate(nextCoord.x, nextCoord.y);

			if (grid[nextCoord.y][nextCoord.x] === "#") {
				if ((turns.get(coord) ?? -1) === guard.bearing) {
					return new Set<string>();
				} else {
					turns.set(coord, guard.bearing);
					guard.bearing = (guard.bearing + 90) % 360;
				}
			} else {
				guard.x = nextCoord.x;
				guard.y = nextCoord.y;
				guard.path.add(coord);
			}
		} else {
			break;
		}
	}

	return guard.path;
}
function alterGuardPath({ grid, guard }: Lab, guardPath: Set<string>): number {
	let infiniteLoops = 0;

	for (const point of [...guardPath]) {
		const [x, y] = point.split(",").map(Number);
		grid[y][x] = "#";

		const path = getGuardPath({ grid, guard: structuredClone(guard) });

		if (path.size === 0) {
			infiniteLoops++;
		}

		grid[y][x] = ".";
	}

	return infiniteLoops;
}
