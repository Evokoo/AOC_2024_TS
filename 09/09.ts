// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const sequence: Sequence = parseInput(data);
	return calculateChecksum(shiftBits(sequence));
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const sequence: Sequence = parseInput(data);
	return calculateChecksum(shiftBlocks(sequence));
}

type BitSequence = (string | number)[];

interface Block {
	id: number;
	isData: boolean;
	size: number;
}

interface Sequence {
	bits: BitSequence;
	blocks: Block[];
}

// Functions
function parseInput(data: string) {
	let bits: BitSequence = [];
	const blocks: Block[] = [];

	for (let i = 0, id = 0; i < data.length; i++) {
		const n: number = Number(data[i]);

		if (i > 0 && i % 2 !== 0) {
			bits = bits.concat(Array(n).fill("."));
			blocks.push({ isData: false, id: -1, size: n });
		} else {
			bits = bits.concat(Array(n).fill(id));
			blocks.push({ isData: true, id, size: n });
			id++;
		}
	}

	return { bits, blocks };
}
function shiftBits({ bits }: Sequence): BitSequence {
	for (let i = 0, j = bits.length - 1; i < j; i++) {
		if (bits[i] === ".") {
			while (bits[j] === ".") j--;
			[bits[i], bits[j]] = [bits[j], bits[i]];
		}
	}

	return bits;
}
function shiftBlocks({ blocks }: Sequence): BitSequence {
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
