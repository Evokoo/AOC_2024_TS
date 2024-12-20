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
	return shortcuts(maze, 20);
}

type Point = { x: number; y: number };
type Path = Map<string, number>;

type Racer = {
	x: number;
	y: number;
	time: number;
};

interface Maze {
	start: Point;
	end: Point;
	walls: Set<string>;
}

// Functions
function parseInput(data: string): Maze {
	const grid: string[][] = data.split("\n").map((row) => [...row]);
	const size: Point = { x: grid[0].length, y: grid.length };
	const maze: Maze = {
		start: { x: 0, y: 0 },
		end: { x: 0, y: 0 },
		walls: new Set(),
	};

	for (let y = 0; y < size.y; y++) {
		for (let x = 0; x < size.x; x++) {
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
function navigateMaze({ start, end, walls }: Maze): Path {
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
			return visited;
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
function shortcuts(maze: Maze, maxStep: number): number {
	const timeSaves: Map<number, number> = new Map();
	const path: Path = navigateMaze(maze);

	const pathPoints: [Point, number][] = [...path].map(([coord, time]) => {
		const [x, y] = coord.split(",").map(Number);
		return [{ x, y }, time];
	});

	for (let i = 0; i < pathPoints.length; i++) {
		const [current, currentTime] = pathPoints[i];

		for (let j = i + 1; j < pathPoints.length; j++) {
			const [neighbor, neighborTime] = pathPoints[j];
			const distance = TOOLS.manhattanDistance(current, neighbor);

			if (distance > 1 && distance <= maxStep) {
				const timeSaved = neighborTime - (currentTime + distance);

				if (timeSaved >= 100) {
					timeSaves.set(timeSaved, (timeSaves.get(timeSaved) ?? 0) + 1);
				}
			}
		}
	}

	return [...timeSaves].reduce((acc, [_, count]) => acc + count, 0);
}
