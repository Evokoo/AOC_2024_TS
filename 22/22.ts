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
	const secretNumbers: number[] = parseInput(data);
	return findOptimalSequence(secretNumbers, 2000);
}

// Functions
function parseInput(data: string): number[] {
	return data.split("\n").map(Number);
}
function generateSecretNumber(n: number): number {
	n = (n ^ (n * 64)) % 16777216;
	n = (n ^ Math.floor(n / 32)) % 16777216;
	n = (n ^ (n * 2048)) % 16777216;

	if (n < 0) {
		n += 16777216;
	}

	return n;
}
function secretNumberSum(secretNumbers: number[], iterations: number) {
	const nthSecretNumbers: number[] = secretNumbers.map((n) => {
		for (let i = 0; i < iterations; i++) {
			n = generateSecretNumber(n);
		}
		return n;
	});

	const secretNumberSum: number = nthSecretNumbers.reduce(
		(acc, cur) => acc + cur,
		0
	);

	return secretNumberSum;
}
function findOptimalSequence(secretNumbers: number[], iterations: number) {
	const sequencePrices: Map<string, number> = new Map();
	const optimal = { sequence: "", price: 0 };

	for (const secretNumber of secretNumbers) {
		for (const [sequence, price] of generateSequence(
			secretNumber,
			iterations
		)) {
			sequencePrices.set(sequence, (sequencePrices.get(sequence) ?? 0) + price);
		}
	}

	for (const [sequence, price] of sequencePrices) {
		if (price >= optimal.price) {
			optimal.sequence = sequence;
			optimal.price = price;
		}
	}

	return optimal.price;
}
function generateSequence(n: number, interations: number): Map<string, number> {
	const secretNumbers: { secretNum: number; price: number; change: string }[] =
		[
			{
				secretNum: n,
				price: n % 10,
				change: "0",
			},
		];

	for (let i = 0, secretNum = n, lastPrice = n % 10; i < interations; i++) {
		secretNum = generateSecretNumber(secretNum);
		const price = secretNum % 10;
		const change = String(price - lastPrice);

		secretNumbers.push({ secretNum, price: lastPrice, change });

		lastPrice = price;
	}

	const sequences: Map<string, number> = new Map();

	for (let i = 4; i < secretNumbers.length; i++) {
		const price = secretNumbers[i].price;
		const sequence: string = secretNumbers
			.slice(i - 4, i)
			.map(({ change }) => change)
			.join(",");

		if (!sequences.has(sequence)) {
			sequences.set(sequence, price);
		}
	}

	return sequences;
}
