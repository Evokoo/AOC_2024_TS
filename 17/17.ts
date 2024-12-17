// Imports
import TOOLS from "tools";
import { Registers, Intcode } from "./Intcode.ts";

//Solutions
export function solveA(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const setup: IntcodeSetup = parseInput(data);
	return runIntCode(setup);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

interface IntcodeSetup {
	registers: Registers;
	program: number[];
}

// Functions
function parseInput(data: string): IntcodeSetup {
	const lines: string[] = data.split("\n");

	const registerA = Number((lines[0].match(/\d+/) || [])[0]);
	const registerB = Number((lines[1].match(/\d+/) || [])[0]);
	const registerC = Number((lines[2].match(/\d+/) || [])[0]);
	const program = (lines[4].match(/\d+/g) || []).map(Number);

	return {
		registers: { a: registerA, b: registerB, c: registerC },
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

	const output: number[] = computer.printResult;

	return output.join(",");
}
