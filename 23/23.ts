// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const computers: ComputerMap = parseInput(data);
	return networkSets(computers);
}
export function solveB(fileName: string, day: string): string {
	const data = TOOLS.readData(fileName, day);
	const computers: ComputerMap = parseInput(data);
	return findPassword(computers);
}

type ComputerMap = Map<string, Set<string>>;
type State = { computer: string; connections: string[] };
type Result = { arr: string[]; length: number };

// Functions
function parseInput(data: string): ComputerMap {
	const network: ComputerMap = new Map();

	for (const line of data.split("\n")) {
		const [a, b] = line.split("-");

		network.set(a, new Set([...(network.get(a) ?? []), b]));
		network.set(b, new Set([...(network.get(b) ?? []), a]));
	}

	return network;
}
function networkSets(computers: ComputerMap): number {
	const groups: Set<string> = new Set();

	for (const [com1, connectedTo] of computers) {
		const connections = [...connectedTo];

		for (let i = 0; i < connections.length; i++) {
			const com2: string = connections[i];

			for (let j = i + 1; j < connections.length; j++) {
				const com3: string = connections[j];

				if (computers.get(com2)!.has(com3)) {
					const sequence = [com1, com2, com3].sort().join(",");

					if (/t\w/.test(sequence)) {
						groups.add(sequence);
					}
				}
			}
		}
	}

	return groups.size;
}
function findPassword(computers: ComputerMap): string {
	const output: Result = { arr: [], length: 0 };

	function DFS(computer: string): void {
		const queue: State[] = [{ computer, connections: [computer] }];
		const result: Result = { arr: [], length: 0 };

		while (queue.length) {
			const { computer, connections }: State = queue.pop()!;

			if (connections.length < result.length) {
				continue;
			}

			for (const testComputer of computers.get(computer)!) {
				const testConnections = computers.get(testComputer)!;

				if (connections.every((com) => testConnections.has(com))) {
					queue.push({
						computer: testComputer,
						connections: [...connections, testComputer],
					});
				} else {
					result.arr = connections;
					result.length = connections.length;
				}
			}
		}

		if (result.length > output.length) {
			output.arr = result.arr;
			output.length = result.length;
		}
	}

	for (const [computer, _] of computers) {
		if (output.arr.includes(computer)) {
			continue;
		} else {
			DFS(computer);
		}
	}

	return output.arr.sort().join(",");
}
