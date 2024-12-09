// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const sequence: Sequence = parseInput(data);
	return calculateChecksum(shiftData(sequence));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type DataSequence = (string | number)[];

interface Sequence {
	forward: DataSequence;
	reverse: DataSequence;
}

// Functions
function parseInput(data: string): Sequence {
	let id = 0;
	let forward: DataSequence = [];
	let reverse: DataSequence = [];

	for (let i = 0; i < data.length; i++) {
		const n: number = Number(data[i]);

		if (i > 0 && i % 2 !== 0) {
			forward = [...forward, ...Array(n).fill(".")];
		} else {
			forward = [...forward, ...Array(n).fill(id)];
			reverse = [...Array(n).fill(id), ...reverse];
			id++;
		}
	}

	return { forward, reverse };
}
function shiftData({ forward, reverse }: Sequence): DataSequence {
	let removed = 0;

	for (let i = 0; i < forward.length; i++) {
		if (forward[i] === ".") {
			forward[i] = reverse.shift()!;
			removed++;
		}
	}

	return forward.slice(0, -removed);
}
function calculateChecksum(sequence: DataSequence): number {
	let checksum = 0;

	for (let i = 0; i < sequence.length; i++) {
		checksum += i * +sequence[i];
	}

	return checksum;
}
