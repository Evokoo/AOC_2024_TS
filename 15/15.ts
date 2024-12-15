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
	return 0;
}

type Point = { x: number; y: number };
type Box = Point & { id: number };

interface Warehouse {
	robot: Point;
	boxes: Box[];
	walls: Map<number, Set<number>>;
	path: string[];
}

// Functions
function parseInput(data: string): Warehouse {
	const inputSections = data.split("\n\n");
	const grid: string[] = inputSections[0].split("\n");
	const path: string[] = inputSections[1].match(/./g) || [];

	const robot: Point = { x: 0, y: 0 };
	const boxes: Box[] = [];
	const walls: Map<number, Set<number>> = new Map();

	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			switch (grid[y][x]) {
				case "#":
					walls.set(y, new Set([...(walls.get(y) ?? new Set()), x]));
					break;
				case "O":
					boxes.push({ id: boxes.length, x, y });
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
function simulateRobot({ robot, boxes, walls, path }: Warehouse): number {
	for (const direction of path) {
		const boxesToMove: number[] = [];
		let [x, y, validMove, steps] = [robot.x, robot.y, true, 1];

		if (direction === ">") {
			while (validMove) {
				const nextX = x + steps;
				const box = boxes.find((box) => box.x === nextX && box.y === y);
				const isWall = (walls.get(y) ?? new Set()).has(nextX);

				if (box) {
					boxesToMove.push(box.id);
				} else if (isWall) {
					validMove = false;
					break;
				} else if (!box && !isWall) {
					break;
				}

				steps++;
			}

			if (validMove) {
				for (const id of boxesToMove) {
					const box = boxes[id];
					boxes[id] = { id: box.id, x: box.x + 1, y: box.y };
				}

				robot.x += 1;
			}
		}

		if (direction === "<") {
			while (validMove) {
				const nextX = x - steps;
				const box = boxes.find((box) => box.x === nextX && box.y === y);
				const isWall = (walls.get(y) ?? new Set()).has(nextX);

				if (box) {
					boxesToMove.push(box.id);
				} else if (isWall) {
					validMove = false;
					break;
				} else if (!box && !isWall) {
					break;
				}

				steps++;
			}

			if (validMove) {
				for (const id of boxesToMove) {
					const box = boxes[id];
					boxes[id] = { id: box.id, x: box.x - 1, y: box.y };
				}

				robot.x -= 1;
			}
		}

		if (direction === "^") {
			while (validMove) {
				const nextY = y - steps;
				const box = boxes.find((box) => box.x === x && box.y === nextY);
				const isWall = (walls.get(nextY) ?? new Set()).has(x);

				if (box) {
					boxesToMove.push(box.id);
				} else if (isWall) {
					validMove = false;
					break;
				} else if (!box && !isWall) {
					break;
				}

				steps++;
			}

			if (validMove) {
				for (const id of boxesToMove) {
					const box = boxes[id];
					boxes[id] = { id: box.id, x: box.x, y: box.y - 1 };
				}

				robot.y -= 1;
			}
		}

		if (direction === "v") {
			while (validMove) {
				const nextY = y + steps;
				const box = boxes.find((box) => box.x === x && box.y === nextY);
				const isWall = (walls.get(nextY) ?? new Set()).has(x);

				if (box) {
					boxesToMove.push(box.id);
				} else if (isWall) {
					validMove = false;
					break;
				} else if (!box && !isWall) {
					break;
				}

				steps++;
			}

			if (validMove) {
				for (const id of boxesToMove) {
					const box = boxes[id];
					boxes[id] = { id: box.id, x: box.x, y: box.y + 1 };
				}

				robot.y += 1;
			}
		}
	}

	// printGrid({ robot, boxes, walls, path }, 20);

	return calculateGPSScore(boxes);
}

function calculateGPSScore(boxes: Box[]): number {
	let total = 0;

	for (const { x, y } of boxes) {
		total += y * 100 + x;
	}

	return total;
}

function printGrid({ robot, boxes, walls }: Warehouse, gridSize: number): void {
	const grid = Array.from({ length: gridSize }, () =>
		Array.from({ length: gridSize }, () => ".")
	);

	grid[robot.y][robot.x] = "@";

	for (const { x, y } of boxes) {
		grid[y][x] = "O";
	}

	for (const [y, xSet] of [...walls]) {
		for (const x of [...xSet]) {
			grid[y][x] = "#";
		}
	}

	const strGrid = grid.map((row) => row.join("")).join("\n");

	console.log(strGrid);
}
