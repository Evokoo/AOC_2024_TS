// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid = parseInput(data);
	return wordSearch(grid);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const grid = parseInput(data);
	return crossSearch(grid);
}

type Grid = string[][];
type Point = { x: number; y: number };

// Functions
function parseInput(input: string): Grid {
	return input.split("\n").map((row) => [...row]);
}

function isValidWord(grid: Grid, points: Point[]): boolean {
	return points.every(({ x, y }, i) => grid[y][x] === "XMAS"[i]);
}

function wordSearch(grid: Grid): number {
	const maxY = grid.length;
	const maxX = grid[0].length;
	let count = 0;

	for (let y = 0; y < maxY; y++) {
		for (let x = 0; x < maxX; x++) {
			const currentCharacter = grid[y][x];
			if (currentCharacter !== "X") continue;

			// West
			if (x >= 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x - 1, y },
						{ x: x - 2, y },
						{ x: x - 3, y },
					])
				) {
					count++;
				}
			}

			// East
			if (x <= maxX - 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x + 1, y },
						{ x: x + 2, y },
						{ x: x + 3, y },
					])
				) {
					count++;
				}
			}

			// North
			if (y >= 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x, y: y - 1 },
						{ x, y: y - 2 },
						{ x, y: y - 3 },
					])
				) {
					count++;
				}
			}

			// South
			if (y < maxY - 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x, y: y + 1 },
						{ x, y: y + 2 },
						{ x, y: y + 3 },
					])
				) {
					count++;
				}
			}

			// North West
			if (x >= 3 && y >= 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x - 1, y: y - 1 },
						{ x: x - 2, y: y - 2 },
						{ x: x - 3, y: y - 3 },
					])
				) {
					count++;
				}
			}

			// North East
			if (x <= maxX - 3 && y >= 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x + 1, y: y - 1 },
						{ x: x + 2, y: y - 2 },
						{ x: x + 3, y: y - 3 },
					])
				) {
					count++;
				}
			}

			// South West
			if (x >= 3 && y < maxY - 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x - 1, y: y + 1 },
						{ x: x - 2, y: y + 2 },
						{ x: x - 3, y: y + 3 },
					])
				) {
					count++;
				}
			}

			// South East
			if (x <= maxX - 3 && y < maxY - 3) {
				if (
					isValidWord(grid, [
						{ x, y },
						{ x: x + 1, y: y + 1 },
						{ x: x + 2, y: y + 2 },
						{ x: x + 3, y: y + 3 },
					])
				) {
					count++;
				}
			}
		}
	}

	return count;
}

function crossSearch(grid: Grid): number {
	const maxY = grid.length;
	const maxX = grid[0].length;
	let count = 0;

	for (let y = 1; y < maxY - 1; y++) {
		for (let x = 1; x < maxX - 1; x++) {
			const currentCharacter = grid[y][x];
			if (currentCharacter !== "A") continue;

			const diagonalA = grid[y - 1][x - 1] + grid[y][x] + grid[y + 1][x + 1];
			const diagonalB = grid[y + 1][x - 1] + grid[y][x] + grid[y - 1][x + 1];

			if (
				(diagonalA === "MAS" && diagonalB === "MAS") ||
				(diagonalA === "SAM" && diagonalB === "SAM") ||
				(diagonalA === "MAS" && diagonalB === "SAM") ||
				(diagonalA === "SAM" && diagonalB == "MAS")
			) {
				count++;
			}
		}
	}

	return count;
}
