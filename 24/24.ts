// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const diagram: Diagram = parseInput(data);
	const wireConnections: Wires = connectWires(diagram);
	return parseInt(getWireValue(wireConnections, "z"), 2);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const diagram: Diagram = parseInput(data);
	swapWires(diagram);
	return -1;
}

type Wires = Map<string, number>;
type Instruction = {
	operator: string;
	inputA: string;
	inputB: string;
	output: string;
};
interface Diagram {
	wires: Wires;
	instrctions: Instruction[];
}

// Functions
function parseInput(data: string): Diagram {
	const sections: string[] = data.split("\n\n");
	const wires: Wires = new Map();
	const instrctions: Instruction[] = [];

	for (const wire of sections[0].split("\n")) {
		const [id, value] = wire.split(": ");
		wires.set(id, Number(value));
	}

	for (const line of sections[1].split("\n")) {
		const [inputA, operator, inputB, output]: string[] =
			line.match(/[\w\d]+/g) || [];

		instrctions.push({
			operator,
			inputA,
			inputB,
			output,
		});
	}

	return { wires, instrctions };
}
function connectWires({ wires, instrctions }: Diagram): Wires {
	while (instrctions.length) {
		const { inputA, inputB, operator, output } = instrctions.shift()!;

		if (wires.has(inputA) && wires.has(inputB)) {
			const a = wires.get(inputA)!;
			const b = wires.get(inputB)!;

			switch (operator) {
				case "AND":
					wires.set(output, a & b);
					break;
				case "XOR":
					wires.set(output, a ^ b);
					break;
				case "OR":
					wires.set(output, a | b);
					break;
				default:
					throw Error("Invalid Operator");
			}
		} else {
			instrctions.push({ inputA, inputB, operator, output });
		}
	}

	return wires;
}
function getWireValue(wires: Wires, target: string): string {
	const values: { id: string; value: number }[] = [];

	for (const [id, value] of [...wires]) {
		if (id.startsWith(target)) {
			values.push({ id, value });
		}
	}

	const binaryValue: string = values
		.sort((a, b) => b.id.localeCompare(a.id))
		.reduce((acc, cur) => acc + String(cur.value), "");

	return binaryValue;
}
function swapWires({ wires, instrctions }: Diagram) {}
