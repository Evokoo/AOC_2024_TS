// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const lists = processList(data);
	return calculateTotalDistance(lists);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const lists = processList(data);
	return calculateSimialryScore(lists);
}

// Functions
function processList(list: string): number[][] {
	const pairs: string[] = list.split("\n");
	const listA: number[] = [];
	const listB: number[] = [];

	for (const pair of pairs) {
		const [a, b] = pair.split(/\s+/).map(Number);
		listA.push(a);
		listB.push(b);
	}

	return [listA, listB].map((list) => list.sort((a, b) => a - b));
}

function calculateTotalDistance(lists: number[][]): number {
	return lists[0].reduce((acc, cur, i) => acc + Math.abs(cur - lists[1][i]), 0);
}

function calculateSimialryScore(lists: number[][]): number {
	const frequencyMap = new Map<number, number>();

	for (const n of lists[1]) {
		frequencyMap.set(n, (frequencyMap.get(n) || 0) + 1);
	}

	return lists[0].reduce(
		(acc, cur) => acc + cur * (frequencyMap.get(cur) ?? 0),
		0
	);
}
