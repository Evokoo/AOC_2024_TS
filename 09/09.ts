// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return calculateChecksum(parseInputAsBits(data));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const blocks: Block[] = parseInputAsBlocks(data);
	return calculateChecksum(shiftBlocks(blocks));
}

type BitSequence = (string | number)[];

interface Block {
	id: number;
	isData: boolean;
	size: number;
}

// Functions
function parseInputAsBits(data: string): BitSequence {
	const counts = [...data].map(Number);
	const len = counts.length;
	const bits: BitSequence = [];
	const id = { i: 0, j: ~~(len / 2) };

	for (let i = 0, j = len - 1; i <= j; i++) {
		const n = counts[i];

		if (i % 2 === 0) {
			bits.push(...Array(n).fill(id.i++));
		} else {
			const block = [];

			while (block.length < n) {
				if (counts[j] > 0) {
					block.push(id.j);
					counts[j]--;
				} else {
					id.j--;
					j -= 2;
				}
			}
			bits.push(...block);
		}
	}

	return bits;
}
function parseInputAsBlocks(data: string): Block[] {
	const blocks: Block[] = [];

	for (let i = 0, id = 0; i < data.length; i++) {
		const n: number = Number(data[i]);

		if (i > 0 && i % 2 !== 0) {
			blocks.push({ isData: false, id: -1, size: n });
		} else {
			blocks.push({ isData: true, id, size: n });
			id++;
		}
	}

	return blocks;
}
function shiftBlocks(blocks: Block[]): BitSequence {
	const sequence = structuredClone(blocks);
	const output: BitSequence = [];

	while (sequence.length) {
		const current = sequence[0];

		if (current.isData) {
			for (let i = 0; i < current.size; i++) {
				output.push(current.id);
			}
		} else {
			let replacement;

			for (let i = sequence.length - 1; i > 0; i--) {
				const next = sequence[i];

				if (next.isData && next.size <= current.size) {
					replacement = next;
					sequence[i] = { isData: false, id: -1, size: next.size };
					break;
				}
			}

			if (replacement) {
				for (let i = 0; i < replacement.size; i++) {
					output.push(replacement.id);
				}

				if (replacement.size < current.size) {
					sequence[0].size -= replacement.size;
					continue;
				}
			} else {
				for (let i = 0; i < current.size; i++) {
					output.push(".");
				}
			}
		}
		sequence.shift();
	}

	return output;
}
function calculateChecksum(sequence: BitSequence): number {
	let checksum = 0;

	for (let i = 0; i < sequence.length; i++) {
		if (sequence[i] === ".") continue;
		checksum += i * Number(sequence[i]);
	}

	return checksum;
}
