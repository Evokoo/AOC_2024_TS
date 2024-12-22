// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const secretNumbers: number[] = parseInput(data);
	return secretNumberSum(secretNumbers, 2000);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

// Functions
function parseInput(data: string): number[] {
	return data.split("\n").map(Number);
}

function generateSecretNumber(n: number, iterations: number): number {
	for (let i = 0; i < iterations; i++) {
		n = (n ^ (n * 64)) % 16777216;
		n = (n ^ Math.floor(n / 32)) % 16777216;
		n = (n ^ (n * 2048)) % 16777216;

		if (n < 0) {
			n += 16777216;
		}
	}

	return n;
}

function secretNumberSum(secretNumbers: number[], iterations: number) {
	const nthSecretNumbers: number[] = secretNumbers.map((n) =>
		generateSecretNumber(n, iterations)
	);
	const secretNumberSum: number = nthSecretNumbers.reduce(
		(acc, cur) => acc + cur,
		0
	);

	return secretNumberSum;
}
