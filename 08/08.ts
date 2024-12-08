// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return countAntiNodes(grid, true);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid: Grid = parseInput(data);
	return countAntiNodes(grid);
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
function extrapolatePoints(
	A: Point,
	B: Point,
	max: Point,
	min: Point = { x: 0, y: 0 }
): Point[] {
	const points: Point[] = [];
	const slope = (B.y - A.y) / (B.x - A.x);
	const step = B.x > A.x ? 1 : -1;

	for (let x = A.x; x >= min.x && x <= max.x; x += step) {
		const y = A.y + slope * (x - A.x);
		if (y < min.y || y > max.y) break;
		points.push({ x, y });
	}

	for (let x = A.x - step; x >= min.x && x <= max.x; x -= step) {
		const y = A.y + slope * (x - A.x);
		if (y < min.y || y > max.y) break;
		points.unshift({ x, y });
	}

	return points;
}
function isValidDistance(toTest: Point, a: Point, b: Point): boolean {
	const distToA: number = TOOLS.manhattanDistance(toTest, a);
	const distToB: number = TOOLS.manhattanDistance(toTest, b);

	return (
		Math.abs(distToA / distToB) === 0.5 || Math.abs(distToB / distToA) === 0.5
	);
}
function countAntiNodes(
	{ grid, antennas }: Grid,
	validateDistance: boolean = false
): number {
	const [maxX, maxY] = [grid[0].length, grid.length];
	const antiNodes: Set<string> = new Set();

	for (const [_, coordinates] of antennas) {
		const points: Point[] = [...coordinates].map(coordToPoint);

		for (let a = 0; a < points.length; a++) {
			const pointA: Point = points[a];
			for (let b = a + 1; b < points.length; b++) {
				const pointB: Point = points[b];

				const potentialPoints = extrapolatePoints(pointA, pointB, {
					x: maxX,
					y: maxY,
				});

				for (const point of potentialPoints) {
					const currentPoint = coordToString(point.x, point.y);

					if (grid[point.y] && grid[point.y][point.x]) {
						if (validateDistance && isValidDistance(point, pointA, pointB)) {
							antiNodes.add(currentPoint);
						} else if (!validateDistance) {
							antiNodes.add(currentPoint);
						}
					}
				}
			}
		}
	}

	return antiNodes.size;
}
