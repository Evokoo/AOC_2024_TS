// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stones: number[] = parseInput(data);
	return observeStones(stones, 25);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const stones: number[] = parseInput(data);
	return observeStones(stones, 75);
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

function observeStones(stones: number[], blinks: number): number {
	let stoneMap: Map<number, number> = new Map(
		stones.map((stone) => [stone, 1])
	);
	let tempMap: Map<number, number> = new Map();

	for (let i = 0; i < blinks; i++) {
		for (const [stone, count] of [...stoneMap]) {
			if (stone === 0) {
				tempMap.set(1, (tempMap.get(1) ?? 0) + count);
			} else if (hasEvenDigits(stone)) {
				for (const value of splitStone(stone)!) {
					tempMap.set(value, (tempMap.get(value) ?? 0) + count);
				}
			} else {
				const value = stone * 2024;
				tempMap.set(value, (tempMap.get(value) ?? 0) + count);
			}
		}

		stoneMap = tempMap;
		tempMap = new Map();
	}

	let totalStones = 0;

	for (const [_, count] of [...stoneMap]) {
		totalStones += count;
	}

	return totalStones;
}
