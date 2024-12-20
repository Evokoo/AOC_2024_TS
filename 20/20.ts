// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const maze: Maze = parseInput(data);
	return shortcuts(maze, 2);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const maze: Maze = parseInput(data);
	return shortcuts(maze, 2) + shortcuts(maze, 20);
}

type Point = { x: number; y: number };
type Path = Map<string, number>;

type Racer = {
	x: number;
	y: number;
	time: number;
};

type RaceResult = {
	path: Path;
	time: number;
};

interface Maze {
	start: Point;
	end: Point;
	walls: Set<string>;
	size: Point;
	grid: string[][];
}

// Functions
function parseInput(data: string): Maze {
	const grid: string[][] = data.split("\n").map((row) => [...row]);
	const maze: Maze = {
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 },
		walls: new Set(),
		size: { x: grid[0].length, y: grid.length },
		grid,
	};

	for (let y = 0; y < maze.size.y; y++) {
		for (let x = 0; x < maze.size.x; x++) {
			const tile = grid[y][x];

			switch (tile) {
				case "E":
					maze.end = { x, y };
					break;
				case "S":
					maze.start = { x, y };
					break;
				case "#":
					maze.walls.add(`${x},${y}`);
					break;
				default:
					break;
			}
		}
	}

	return maze;
}

function navigateMaze({ start, end, walls }: Maze): RaceResult {
	const queue: Racer[] = [{ x: start.x, y: start.y, time: 0 }];
	const visited: Map<string, number> = new Map();

	while (queue.length) {
		const current: Racer = queue.shift()!;
		const coord: string = `${current.x},${current.y}`;

		if (visited.has(coord)) {
			continue;
		} else {
			visited.set(coord, current.time);
		}

		if (current.x === end.x && current.y === end.y) {
			return { path: visited, time: current.time };
		} else {
			for (const [dx, dy] of [
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 0],
			]) {
				const [nx, ny] = [current.x + dx, current.y + dy];

				if (walls.has(`${nx},${ny}`)) {
					continue;
				} else {
					queue.push({ x: nx, y: ny, time: current.time + 1 });
				}
			}
		}
	}

	throw Error("Route not found");
}

function shortcuts(maze: Maze, step: number): number {
	const { path }: RaceResult = navigateMaze(maze);
	const timeSaves: Map<number, number> = new Map();

	let count = 0;

	for (const [coord, time] of [...path]) {
		const [x, y] = coord.split(",").map(Number);

		for (const [dx, dy] of [
			[0, step],
			[0, -step],
			[step, 0],
			[-step, 0],
		]) {
			const neighbor = `${x + dx},${y + dy}`;

			if (path.has(neighbor)) {
				const neighborTime = path.get(neighbor)!;
				const timeSaved = neighborTime - time - step;

				if (timeSaved >= 100) {
					timeSaves.set(timeSaved, (timeSaves.get(timeSaved) ?? 0) + 1);
					count++;
				}
			}
		}
	}

	return [...timeSaves].reduce((acc, [_, count]) => acc + count, 0);
}

// function printMaze(maze: Maze): void {
// 	const grid = Array.from({ length: maze.size.y }, () =>
// 		Array.from({ length: maze.size.x }, () => ".")
// 	);

// 	grid[maze.start.y][maze.start.x] = "S";
// 	grid[maze.end.y][maze.end.x] = "E";

// 	for (const [y, xSet] of [...maze.walls]) {
// 		for (const x of [...xSet]) {
// 			grid[y][x] = "#";
// 		}
// 	}

// 	const asString = grid.map((row) => row.join("")).join("\n");

// 	console.log(asString + "\n");
// }
