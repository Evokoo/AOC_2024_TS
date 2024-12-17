// Imports
import TOOLS from "tools";
import { Registers, Intcode, IntcodeSetup } from "./Intcode.ts";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const setup: IntcodeSetup = parseInput(data);
	return runIntCode(setup);
}
export function solveB(fileName: string, day: string): bigint {
	const data = TOOLS.readData(fileName, day);
	const setup: IntcodeSetup = parseInput(data);
	return debugIntCode(setup);
}

// Functions
function parseInput(data: string): IntcodeSetup {
	const lines: string[] = data.split("\n");

	const registerA = Number((lines[0].match(/\d+/) || [])[0]);
	const registerB = Number((lines[1].match(/\d+/) || [])[0]);
	const registerC = Number((lines[2].match(/\d+/) || [])[0]);
	const program = (lines[4].match(/\d+/g) || []).map(Number);

	return {
		registers: {
			a: BigInt(registerA),
			b: BigInt(registerB),
			c: BigInt(registerC),
		},
		program,
	};
}
function runIntCode({ registers, program }: IntcodeSetup): string {
	const computer: Intcode = new Intcode(registers.a, registers.b, registers.c);

	while (computer.pointerIndex < program.length) {
		const pointer: number = computer.pointerIndex;
		const opcode: number = program[pointer];
		const operand: number = program[pointer + 1];

		computer.exercute(opcode, operand);
	}

	return computer.printResult.join(",");
}
function debugIntCode({ program }: IntcodeSetup): bigint {
	const targetArray: bigint[] = program.map(BigInt);
	let registerA: bigint = 0n;

	for (let i = 1; i <= targetArray.length; i++) {
		const target: bigint[] = targetArray.slice(targetArray.length - i);
		let a: bigint = registerA << 3n;

		while (true) {
			if (isMatch(target, a)) {
				registerA = a;
				break;
			} else {
				a += 1n;
			}
		}
	}

	return registerA;
}

function isMatch(
	target: bigint[],
	a: bigint,
	b: bigint = 0n,
	c: bigint = 0n,
	output: bigint[] = []
): boolean {
	/*
		Intcode breakdown

		step 1:(2,4) A % 8 -> B
		step 2:(1,1) B ^ 1 -> B
		step 3:(7,5) A / (2 ** B) -> C
		step 4:(4,0) B ^ C -> B
		step 5:(0,3) A / (2 ** 3) -> A
		step 6:(1,6) B ^ 6 -> B
		step 7:(5,5) B % 8 -> OUTPUT
		step 8:(3,0) A == 0 ? EXIT : LOOP
	*/

	b = a % 8n;
	b = b ^ 1n;
	c = a / 2n ** b;
	b = b ^ c;
	a = a / 2n ** 3n;
	b = b ^ 6n;

	const result = b % 8n;

	if (target[output.length] !== result) {
		return false;
	} else {
		output.push(result);
	}

	if (a === 0n) {
		if (output.length !== target.length) {
			return false;
		} else {
			return output.join(",") === target.join(",");
		}
	} else {
		return isMatch(target, a, b, c, output);
	}
}
