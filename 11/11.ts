// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stones: number[] = parseInput(data);
	return observeStones(stones, 25).length;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stones: number[] = parseInput(data);
	return observeStones(stones, 75).length;
}

// Functions
function parseInput(data: string): number[] {
	return data.split(" ").map(Number);
}

function hasEvenDigits(n: number): boolean {
	return String(n).length % 2 === 0;
}
function splitStone(n: number): [number, number] {
	const digits = String(n);
	const center = ~~(digits.length / 2);
	const left: string = digits.slice(0, center);
	const right: string = digits.slice(center);

	return [+left, +right];
}

function observeStones(stones: number[], blinks: number): number[] {
	let tempLine: number[] = [];
	let line: number[] = [...stones];

	for (let i = 0; i < blinks; i++) {
		while (line.length) {
			const stone = line.shift()!;

			if (stone === 0) {
				tempLine.push(1);
			} else if (hasEvenDigits(stone)) {
				tempLine.push(...splitStone(stone));
			} else {
				tempLine.push(stone * 2024);
			}
		}

		line = tempLine;
		tempLine = [];
	}

	return line;
}
