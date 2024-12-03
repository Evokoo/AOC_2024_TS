// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return conditionalMuliplcationSum(
		data,
		RegExp("mul\\(\\d{1,3},\\d{1,3}\\)", "g")
	);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return conditionalMuliplcationSum(
		data,
		RegExp("mul\\(\\d{1,3},\\d{1,3}\\)|do\\(\\)|don\\'t\\(\\)", "g")
	);
}

// Functions
function getProduct(equation: string): number {
	return (equation.match(/\d+/g) || []).reduce(
		(acc, cur) => acc * Number(cur),
		1
	);
}

function conditionalMuliplcationSum(
	data: string,
	re: RegExp,
	sum: number = 0
): number {
	const instructions = data.match(re) || [];

	for (let i = 0, enabled = true; i < instructions.length; i++) {
		const instruction = instructions[i];

		if (instruction.startsWith("mul")) {
			sum += enabled ? getProduct(instruction) : 0;
		} else if (instruction.startsWith("don't")) {
			enabled = false;
		} else if (instruction.startsWith("do")) {
			enabled = true;
		} else {
			throw Error(`Invalid Instruciton: ${instruction}`);
		}
	}

	return sum;
}
