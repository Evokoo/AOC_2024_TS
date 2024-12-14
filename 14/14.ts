// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string, gridSize: Point): number {
	const data = TOOLS.readData(fileName, day);
	const robots: Robot[] = parseInput(data);
	return simulateRobots(robots, 100, gridSize);
}
export function solveB(fileName: string, day: string, gridSize: Point): number {
	const data = TOOLS.readData(fileName, day);
	const robots: Robot[] = parseInput(data);
	return simulateRobots(robots, 10_000, gridSize);
}

type Point = { x: number; y: number };

interface Robot {
	id: number;
	pos: Point;
	vel: Point;
}

// Functions
function parseInput(data: string): Robot[] {
	const robots: Robot[] = data.split("\n").map((line, index) => {
		const [px, py, vx, vy] = (line.match(/-*\d+/g) || []).map(Number);
		return { id: index, pos: { x: px, y: py }, vel: { x: vx, y: vy } };
	});

	return robots;
}
function simulateRobots(
	robots: Robot[],
	time: number,
	gridSize: Point
): number {
	for (let second = 0; second < time; second++) {
		robots = robots.map((robot) => updateRobot(robot, gridSize));

		if (time > 100 && highDensity(robots, gridSize)) {
			return second + 1;
		}
	}
	return getSafetyFactor(robots, gridSize);
}
function updateRobot({ id, pos, vel }: Robot, gridSize: Point): Robot {
	pos.x += vel.x;
	pos.y += vel.y;

	if (pos.x >= gridSize.x) {
		pos.x -= gridSize.x;
	} else if (pos.x < 0) {
		pos.x += gridSize.x;
	}

	if (pos.y >= gridSize.y) {
		pos.y -= gridSize.y;
	} else if (pos.y < 0) {
		pos.y += gridSize.y;
	}

	return { id, pos, vel };
}
function getSafetyFactor(robots: Robot[], gridSize: Point): number {
	const quadrants: number[] = [0, 0, 0, 0];
	const verticalCenter = ~~(gridSize.y / 2);
	const horiztonalCenter = ~~(gridSize.x / 2);

	for (const { pos } of robots) {
		if (pos.x < horiztonalCenter) {
			if (pos.y < verticalCenter) quadrants[0]++;
			if (pos.y > verticalCenter) quadrants[1]++;
		} else if (pos.x > horiztonalCenter) {
			if (pos.y < verticalCenter) quadrants[2]++;
			if (pos.y > verticalCenter) quadrants[3]++;
		}
	}

	return quadrants.reduce((acc, cur) => acc * cur, 1);
}
function highDensity(robots: Robot[], gridSize: Point): boolean {
	const quadrants: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0];
	const [xOneThird, xTwoThird] = [gridSize.x * 0.33, gridSize.x * 0.66];
	const [yOneThird, yTwoThird] = [gridSize.y * 0.33, gridSize.y * 0.66];

	for (const { pos } of robots) {
		if (pos.x < xOneThird) {
			if (pos.y < yOneThird) quadrants[0]++;
			if (pos.y > yOneThird && pos.y < yTwoThird) quadrants[1]++;
			if (pos.y > yTwoThird) quadrants[2]++;
		}

		if (pos.x > xOneThird && pos.x < xTwoThird) {
			if (pos.y < yOneThird) quadrants[3]++;
			if (pos.y > yOneThird && pos.y < yTwoThird) quadrants[4]++;
			if (pos.y > yTwoThird) quadrants[5]++;
		}

		if (pos.x > xTwoThird) {
			if (pos.y < yOneThird) quadrants[6]++;
			if (pos.y > yOneThird && pos.y < yTwoThird) quadrants[7]++;
			if (pos.y > yTwoThird) quadrants[8]++;
		}
	}

	return quadrants.some((q) => q > 200);
}
