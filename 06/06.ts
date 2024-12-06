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
	path: Map<string, number>;
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
					path: new Map([[parseCoordinate(x, y), 0]]),
					bearing: 0,
				};
				return { grid, guard };
			}
		}
	}

	throw Error("Guard not found!");
}

function getGuardPath({ grid, guard }: Lab): Map<string, number> {
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
			if (grid[nextCoord.y][nextCoord.x] === "#") {
				guard.bearing = (guard.bearing + 90) % 360;
			} else {
				guard.x = nextCoord.x;
				guard.y = nextCoord.y;

				const coord = parseCoordinate(nextCoord.x, nextCoord.y);
				const coordCount = (guard.path.get(coord) ?? 0) + 1;

				if (coordCount >= 5) {
					return new Map<string, number>();
				} else {
					guard.path.set(coord, coordCount);
				}
			}
		} else {
			break;
		}
	}

	return guard.path;
}

function alterGuardPath(
	{ grid, guard }: Lab,
	guardPath: Map<string, number>
): number {
	let infiniteLoops = 0;

	for (const [point, _] of [...guardPath]) {
		const gridClone = structuredClone(grid);
		const guardClone = structuredClone(guard);
		const [x, y] = point.split(",").map(Number);

		gridClone[y][x] = "#";

		const path = getGuardPath({ grid: gridClone, guard: guardClone });

		if (path.size === 0) {
			infiniteLoops++;
		}
	}

	return infiniteLoops;
}
