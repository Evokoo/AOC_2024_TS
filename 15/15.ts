// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const warehouse: Warehouse = parseInput(data);
	return simulateRobot(warehouse);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const warehouse: Warehouse = parseInput(data, true);
	return simulateRobot(warehouse, true);
}

type Point = { x: number; y: number };
type Box = { id: number; xA: number; xB: number; y: number };

interface Warehouse {
	robot: Point;
	boxes: Box[];
	walls: Map<number, Set<number>>;
	path: string[];
}

// Functions
function parseInput(data: string, doubleWidth: boolean = false): Warehouse {
	const inputSections = data.split("\n\n");
	const grid: string[] = inputSections[0].split("\n");
	const path: string[] = inputSections[1].match(/./g) || [];

	const robot: Point = { x: 0, y: 0 };
	const boxes: Box[] = [];
	const walls: Map<number, Set<number>> = new Map();

	for (let y = 0; y < grid.length; y++) {
		const row = doubleWidth ? extendRow(grid[y]) : grid[y];
		for (let x = 0; x < row.length; x++) {
			switch (row[x]) {
				case "#":
					walls.set(y, new Set([...(walls.get(y) ?? new Set()), x]));
					break;
				case "O":
					boxes.push({
						id: boxes.length,
						xA: x,
						xB: doubleWidth ? x + 1 : x,
						y,
					});
					break;
				case "@":
					robot.x = x;
					robot.y = y;
					break;
			}
		}
	}

	return { robot, boxes, walls, path };
}
function extendRow(row: string): string {
	return row.replace(/./g, (char) => {
		switch (char) {
			case ".":
				return "..";
			case "#":
				return "##";
			case "@":
				return "@.";
			case "O":
				return "O.";
			default:
				return char;
		}
	});
}
function simulateRobot(
	{ robot, boxes, walls, path }: Warehouse,
	doubleWidth: boolean = false
): number {
	for (const direction of path) {
		const boxesToMove: Set<number> = new Set();
		let xRange: number[] = [robot.x];
		let y: number = robot.y;
		let validMove = true;

		//Horizontal Movement
		if (direction === "<" || direction === ">") {
			const wallLocations = walls.get(y) ?? new Set();

			while (validMove) {
				const nextX = direction === "<" ? xRange[0] - 1 : xRange[0] + 1;
				const adjacentWall = wallLocations.has(nextX);
				const adjacentBox = boxes.find(
					(box) => (box.xA === nextX || box.xB === nextX) && box.y === y
				);

				if (adjacentWall) {
					validMove = false;
					break;
				} else if (adjacentBox) {
					boxesToMove.add(adjacentBox.id);

					if (doubleWidth) {
						xRange = [direction === "<" ? adjacentBox.xA : adjacentBox.xB];
					} else {
						xRange = [adjacentBox.xA];
					}
				} else {
					break;
				}
			}
		}

		//Vertical Movement
		if (direction === "v" || direction === "^") {
			while (validMove) {
				const nextY = direction === "v" ? y + 1 : y - 1;
				const wallLocations = walls.get(nextY) ?? new Set();

				for (const x of xRange) {
					if (wallLocations.has(x)) {
						validMove = false;
						break;
					}
				}
				const adjacentBoxes = boxes.filter(
					(box) =>
						(xRange.includes(box.xA) || xRange.includes(box.xB)) &&
						box.y === nextY
				);

				if (adjacentBoxes.length) {
					const newXRange = [];

					for (const box of adjacentBoxes) {
						boxesToMove.add(box.id);
						newXRange.push(box.xA, box.xB);
					}

					xRange = newXRange;
					y = nextY;
				} else {
					break;
				}
			}
		}

		if (validMove) {
			for (const id of [...boxesToMove]) {
				const box = boxes[id];

				switch (direction) {
					case ">":
						boxes[id] = { ...box, xA: box.xA + 1, xB: box.xB + 1 };
						break;
					case "<":
						boxes[id] = { ...box, xA: box.xA - 1, xB: box.xB - 1 };
						break;
					case "^":
						boxes[id] = { ...box, y: box.y - 1 };
						break;
					case "v":
						boxes[id] = { ...box, y: box.y + 1 };
						break;
				}
			}

			switch (direction) {
				case ">":
					robot.x += 1;
					break;
				case "<":
					robot.x -= 1;
					break;
				case "^":
					robot.y -= 1;
					break;
				case "v":
					robot.y += 1;
					break;
			}
		}
	}

	return calculateBoxScore(boxes);
}

function calculateBoxScore(boxes: Box[]): number {
	return boxes.reduce((score, { xA, y }) => score + (y * 100 + xA), 0);
}
