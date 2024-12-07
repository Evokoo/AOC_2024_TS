// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const equations: Equation[] = parseInput(data);
	return getTotalCalibration(equations);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const equations: Equation[] = parseInput(data);
	return getTotalCalibration(equations, true);
}

type Equation = {
	total: number;
	values: number[];
};

// Functions
function parseInput(input: string): Equation[] {
	const equations: Equation[] = [];

	for (const line of input.split("\n")) {
		const nums: number[] = (line.match(/\d+/g) || []).map(Number);
		equations.push({ total: nums.shift()!, values: nums });
	}
	return equations;
}
function getTotalCalibration(
	equations: Equation[],
	concatentate: boolean = false
): number {
	let totalCalibration: number = 0;

	for (const equation of equations) {
		if (validateEquation(equation)) {
			totalCalibration += equation.total;
		} else if (concatentate && validateEquation(equation, concatentate)) {
			totalCalibration += equation.total;
		}
	}

	return totalCalibration;
}
function validateEquation(
	equation: Equation,
	concatentate: boolean = false
): boolean {
	const targetTotal: number = equation.total;
	const queue: { total: number; values: number[] }[] = [
		{ total: equation.values[0], values: equation.values.slice(1) },
	];

	while (queue.length) {
		const current = queue.pop()!;

		if (current.total > targetTotal) {
			continue;
		} else if (current.total === targetTotal && current.values.length === 0) {
			return true;
		} else if (current.values.length) {
			const nextValue: number = current.values[0];

			queue.push({
				total: current.total + nextValue,
				values: current.values.slice(1),
			});
			queue.push({
				total: current.total * nextValue,
				values: current.values.slice(1),
			});

			if (concatentate) {
				queue.push({
					total: Number(`${current.total}${nextValue}`),
					values: current.values.slice(1),
				});
			}
		}
	}

	return false;
}
