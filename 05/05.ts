// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const printData: PrintData = parseInput(data);
	const { valid } = validatePrintOrders(printData);
	return middlePageSum(valid);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const printData: PrintData = parseInput(data);
	const { invalid } = validatePrintOrders(printData);
	const validOrders = fixOrders(invalid, printData);
	return middlePageSum(validOrders);
}

// Types and Interface
type Rules = {
	before: Map<number, Set<number>>;
	after: Map<number, Set<number>>;
};
type Orders = number[][];

interface PrintData {
	rules: Rules;
	orders: Orders;
}

// Functions
function parseInput(data: string): PrintData {
	const lines = data.split("\n").filter((line) => line);
	const rules: Rules = { before: new Map(), after: new Map() };
	const orders: Orders = [];

	for (const line of lines) {
		if (line.includes("|")) {
			const [x, y] = line.split("|").map(Number);
			rules.before.set(x, (rules.before.get(x) ?? new Set()).add(y));
			rules.after.set(y, (rules.after.get(y) ?? new Set()).add(x));
		} else {
			const pages = line.split(",").map(Number);
			orders.push(pages);
		}
	}
	return { rules, orders };
}
function validatePrintOrders({ rules, orders }: PrintData): {
	valid: Orders;
	invalid: Orders;
} {
	const validOrders: number[][] = [];
	const invalidOrders: number[][] = [];

	for (const order of orders) {
		let isValid = true;

		for (let i = 0; i < order.length; i++) {
			if (!isValid) break;

			const currentPage = order[i];
			for (let j = i + 1; j < order.length; j++) {
				const nextPage = order[j];

				const validPages = rules.before.get(currentPage);
				if (validPages?.has(nextPage)) continue;

				isValid = false;
				break;
			}
		}

		if (isValid) {
			validOrders.push(order);
		} else {
			invalidOrders.push(order);
		}
	}

	return { valid: validOrders, invalid: invalidOrders };
}
function fixOrders(invalidOrders: Orders, { rules }: PrintData): Orders {
	const orders: Orders = invalidOrders;

	for (const order of orders) {
		const n = order.length;
		let swapped = true;

		do {
			swapped = false;
			for (let i = 0; i < n - 1; i++) {
				if (rules.before.get(order[i + 1])?.has(order[i])) {
					[order[i], order[i + 1]] = [order[i + 1], order[i]];
					swapped = true;
				}
			}
		} while (swapped);
	}

	return orders;
}
function middlePageSum(validOrders: Orders): number {
	return validOrders.reduce(
		(acc, cur) => acc + Number(cur[~~(cur.length / 2)]),
		0
	);
}
