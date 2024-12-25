// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return parseInput(data);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

// Functions
function parseInput(data: string): number {
	const schematics: string[] = data.split("\n\n");
	const keys: number[][] = [];
	const locks: number[][] = [];

	for (const schematic of schematics) {
		const grid: string[][] = schematic.split("\n").map((row) => [...row]);
		const isLock: boolean = grid[0].every((cell) => cell === "#");
		const design: number[] = Array.from({ length: grid[0].length }, () => 0);

		for (let col = 0; col < grid[0].length; col++) {
			for (let row = 0; row < grid.length; row++) {
				if (grid[row][col] === "#") {
					design[col]++;
				}
			}
		}

		isLock ? locks.push(design) : keys.push(design);
	}

	let matches = 0;

	for (const key of keys) {
		for (const lock of locks) {
			if (key.every((pin, index) => pin + lock[index] <= 7)) {
				matches++;
			}
		}
	}

	return matches;
}
