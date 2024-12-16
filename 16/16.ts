// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const eventDetails: EventDetails = parseInput(data);
	return navigateMaze(eventDetails);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const eventDetails: EventDetails = parseInput(data);
	return navigateMaze(eventDetails);
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

function navigateMaze({ reindeer, maze }: EventDetails) {
	const queue: Reindeer[] = [reindeer];
	const seen: Set<string> = new Set();
	const optimal: { score: number; seating: Set<string> } = {
		score: Infinity,
		seating: new Set(),
	};

	while (queue.length) {
		const { position, bearing, steps, turns, path } = queue.shift()!;
		const currentState: string = `${position.x},${position.y}@${bearing}`;

		if (seen.has(currentState)) {
			continue;
		} else {
			seen.add(currentState);
		}

		if (position.y === maze.end.y && position.x === maze.end.x) {
			console.log(seen);
			return scoreRoute({ position, bearing, steps, turns, path });
		} else {
			const north = maze.grid[position.y - 1][position.x];
			const south = maze.grid[position.y + 1][position.x];
			const east = maze.grid[position.y][position.x + 1];
			const west = maze.grid[position.y][position.x - 1];

			if (north !== "#") {
				if (bearing === 0) {
					queue.push({
						position: { x: position.x, y: position.y - 1 },
						bearing,
						steps: steps + 1,
						turns,
						path: new Set([...path, `${position.x},${position.y}`]),
					});
				} else {
					queue.push({
						position,
						bearing: 0,
						steps,
						turns: turns + requiredTurns(bearing, 0),
						path,
					});
				}
			}

			if (south !== "#") {
				if (bearing === 180) {
					queue.push({
						position: { x: position.x, y: position.y + 1 },
						bearing,
						steps: steps + 1,
						turns,
						path: new Set([...path, `${position.x},${position.y}`]),
					});
				} else {
					queue.push({
						position,
						bearing: 180,
						steps,
						turns: turns + requiredTurns(bearing, 180),
						path,
					});
				}
			}

			if (east !== "#") {
				if (bearing === 90) {
					queue.push({
						position: { x: position.x + 1, y: position.y },
						bearing,
						steps: steps + 1,
						turns,
						path: new Set([...path, `${position.x},${position.y}`]),
					});
				} else {
					queue.push({
						position,
						bearing: 90,
						steps,
						turns: turns + requiredTurns(bearing, 90),
						path,
					});
				}
			}

			if (west !== "#") {
				if (bearing === 270) {
					queue.push({
						position: { x: position.x - 1, y: position.y },
						bearing,
						steps: steps + 1,
						turns,
						path: new Set([...path, `${position.x},${position.y}`]),
					});
				} else {
					queue.push({
						position,
						bearing: 270,
						steps,
						turns: turns + requiredTurns(bearing, 270),
						path,
					});
				}
			}
		}

		queue.sort((a, b) => scoreRoute(a) - scoreRoute(b));
	}

	return optimal.score;
}

function scoreRoute({ turns, steps }: Reindeer): number {
	return turns * 1000 + steps;
}
function requiredTurns(currentBearing: number, targetBearing: number): number {
	return (
		Math.min(
			(targetBearing - currentBearing + 360) % 360,
			(currentBearing - targetBearing + 360) % 360
		) / 90
	);
}
// function printMaze(grid: string[][], seating: string[]): void {
// 	for (const seat of seating) {
// 		const [x, y] = seat.split(",").map(Number);
// 		grid[y][x] = "0";
// 	}

// 	const str: string = grid.map((row) => row.join("")).join("\n");

// 	console.log(str);
// }
