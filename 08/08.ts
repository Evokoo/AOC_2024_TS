// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	const anitNodes: Point[] = findAntiNodes(grid, true);
	return anitNodes.length;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	const anitNodes: Point[] = findAntiNodes(grid);
	return anitNodes.length;
}

type Antennas = Map<string, Set<string>>;
type Point = { x: number; y: number };

interface Grid {
	grid: string[][];
	antennas: Antennas;
	occupied: Set<string>;
}

// Functions
function parseInput(data: string): Grid {
	const grid: string[][] = data.split("\n").map((row) => [...row]);
	const antennas: Antennas = new Map();
	const occupied: Set<string> = new Set();

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			const currentCoord = grid[y][x];

			if (currentCoord !== ".") {
				const coordCode = coordToString(x, y);
				const currentPoints = antennas.get(currentCoord) ?? new Set();

				currentPoints.add(coordCode);
				occupied.add(coordCode);

				antennas.set(currentCoord, currentPoints);
			}
		}
	}

	return { grid, antennas, occupied };
}
function coordToString(x: number, y: number): string {
	return `${x},${y}`;
}
function coordToPoint(coord: string): Point {
	const [x, y] = coord.split(",").map(Number);
	return { x, y };
}

function generateLineWithinLimits(
	A: Point,
	B: Point,
	xMin: number,
	xMax: number,
	yMin: number,
	yMax: number
): Point[] {
	const points: Point[] = [];
	const slope = A.x === B.x ? null : (B.y - A.y) / (B.x - A.x);

	if (slope === null) {
		// Vertical Line
		const step = B.y > A.y ? 1 : -1;
		for (let y = A.y; y >= yMin && y <= yMax; y += step) {
			points.push({ x: A.x, y });
		}
	} else {
		// Regular line
		const step = B.x > A.x ? 1 : -1;

		for (let x = A.x; x >= xMin && x <= xMax; x += step) {
			const y = A.y + slope * (x - A.x);
			if (y < yMin || y > yMax) break;
			points.push({ x, y });
		}

		for (let x = A.x - step; x >= xMin && x <= xMax; x -= step) {
			const y = A.y + slope * (x - A.x);
			if (y < yMin || y > yMax) break;
			points.unshift({ x, y });
		}
	}

	return points;
}
function findAntiNodes(
	{ grid, antennas, occupied }: Grid,
	distance: boolean = false
) {
	const [maxX, maxY] = [grid[0].length, grid.length];
	const antiNodes: Point[] = [];

	for (const [_, coordinates] of antennas) {
		const points: Point[] = [...coordinates].map(coordToPoint);

		for (let a = 0; a < points.length; a++) {
			const pointA: Point = points[a];
			for (let b = a + 1; b < points.length; b++) {
				const pointB: Point = points[b];

				const possiblePoints = generateLineWithinLimits(
					pointA,
					pointB,
					0,
					maxX,
					0,
					maxY
				);

				for (const point of possiblePoints) {
					if (occupied.has(coordToString(point.x, point.y))) {
						continue;
					}

					if (distance) {
						const distToA: number = TOOLS.manhattanDistance(point, pointA);
						const distToB: number = TOOLS.manhattanDistance(point, pointB);

						if (
							Math.abs(distToA / distToB) === 0.5 ||
							Math.abs(distToB / distToA) === 0.5
						) {
							antiNodes.push(point);
						}
					} else {
						antiNodes.push(point);
					}
				}
			}
		}
	}

	console.log(antiNodes);

	return antiNodes;
}
