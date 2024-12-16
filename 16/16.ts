// Imports
import TOOLS from "tools";
import { BinaryHeap } from "@std/data-structures";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const eventDetails: EventDetails = parseInput(data);
	return navigateMaze(eventDetails).score;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const eventDetails: EventDetails = parseInput(data);
	return locateSeating(eventDetails);
}

type Point = { x: number; y: number };

type Reindeer = {
	position: Point;
	bearing: number;
	steps: number;
	turns: number;
	path: Set<string>;
};
type Maze = {
	grid: string[][];
	end: Point;
};
interface EventDetails {
	reindeer: Reindeer;
	maze: Maze;
}
interface OptimalRoute {
	score: number;
	route: Set<string>;
}

// Functions
function parseInput(data: string): EventDetails {
	const grid: string[][] = data.split("\n").map((row) => [...row]);
	const start: Point = { x: 0, y: 0 };
	const end: Point = { x: 0, y: 0 };

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			switch (grid[y][x]) {
				case "S":
					start.x = x;
					start.y = y;
					grid[y][x] = ".";
					break;
				case "E":
					end.x = x;
					end.y = y;
					grid[y][x] = ".";
					break;
				default:
					break;
			}
		}
	}

	return {
		reindeer: {
			position: start,
			bearing: 90,
			steps: 0,
			turns: 0,
			path: new Set(),
		},
		maze: {
			grid,
			end,
		},
	};
}

//
function scoreRoute({ turns, steps }: Reindeer): number {
	return turns * 1000 + steps;
}
function requiredTurns(entry: number, exit: number): number {
	const clockwise = (exit - entry + 360) % 360;
	const counterClockwise = (entry - exit + 360) % 360;
	return Math.min(clockwise, counterClockwise) / 90;
}
function createPriorityQueue(state: Reindeer): BinaryHeap<Reindeer> {
	const queue = new BinaryHeap<Reindeer>(
		(a, b) => scoreRoute(a) - scoreRoute(b)
	);
	queue.push(state);

	return queue;
}
//

function navigateMaze(
	{ reindeer, maze }: EventDetails,
	targetScore?: number
): OptimalRoute {
	const queue: BinaryHeap<Reindeer> = createPriorityQueue(reindeer);
	const seen: Set<string> = new Set();
	const optimal: OptimalRoute = {
		score: Infinity,
		route: new Set(),
	};

	while (queue.length) {
		const { position, bearing, steps, turns, path } = queue.pop()!;
		const coord: string = `${position.x},${position.y}`;
		const currentState: string = coord + `@${bearing}`;

		if (
			targetScore &&
			scoreRoute({ position, bearing, steps, turns, path }) > targetScore
		) {
			break;
		}

		if (seen.has(currentState)) {
			continue;
		} else {
			seen.add(currentState);
		}

		if (position.y === maze.end.y && position.x === maze.end.x) {
			optimal.score = scoreRoute({ position, bearing, steps, turns, path });
			optimal.route = path;

			return optimal;
		} else {
			const neighbors = [
				{ direction: "N", dx: 0, dy: -1, targetBearing: 0 },
				{ direction: "S", dx: 0, dy: 1, targetBearing: 180 },
				{ direction: "E", dx: 1, dy: 0, targetBearing: 90 },
				{ direction: "W", dx: -1, dy: 0, targetBearing: 270 },
			];

			for (const { dx, dy, targetBearing } of neighbors) {
				const [nx, ny] = [position.x + dx, position.y + dy];

				if (maze.grid[ny][nx] === "#") {
					continue;
				} else {
					const quarterTurns = requiredTurns(bearing, targetBearing);
					const newPath = new Set(path);

					newPath.add(coord);
					newPath.add(`${nx},${ny}`);

					if (quarterTurns <= 1) {
						queue.push({
							position: { x: nx, y: ny },
							bearing: targetBearing,
							steps: steps + 1,
							turns: turns + quarterTurns,
							path: newPath,
						});
					} else {
						continue;
					}
				}
			}
		}
	}

	return optimal;
}
function locateSeating({ reindeer, maze }: EventDetails): number {
	const target: OptimalRoute = navigateMaze({ reindeer, maze });
	const seating: Set<string> = target.route;

	for (const point of [...target.route]) {
		const [x, y] = point.split(",").map(Number);
		const isFork = [
			[-1, -1],
			[1, 1],
			[-1, 1],
			[1, -1],
		].some(([dx, dy]) => {
			return maze.grid[y + dy][x + dx] === ".";
		});

		if (isFork) {
			maze.grid[y][x] = "#";

			const reRun = navigateMaze({ reindeer, maze }, target.score);

			if (reRun.score !== Infinity) {
				for (const reRunPoint of [...reRun.route]) {
					seating.add(reRunPoint);
				}
			}

			maze.grid[y][x] = ".";
		}
	}

	return seating.size;
}

function printMaze(grid: string[][], seating: string[]): void {
	for (const seat of seating) {
		const [x, y] = seat.split(",").map(Number);
		grid[y][x] = "+";
	}

	const str: string = grid.map((row) => row.join("")).join("\n");

	console.log(str);
}
