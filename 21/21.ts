// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const codes: string[] = parseInput(data);
	return inputCodes(codes);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

type Buttons = string[][];
type ButtonMap = Map<string, Map<string, string>>;
type State = {
	key: string;
	x: number;
	y: number;
	path: string;
	weight: number;
};

// Functions
function parseInput(data: string): string[] {
	return data.split("\n");
}
function getButtonMaps(): { dPad: ButtonMap; numPad: ButtonMap } {
	const directionalPad: Buttons = [
		["_", "^", "A"],
		["<", "v", ">"],
	];
	const numericalPad: Buttons = [
		["7", "8", "9"],
		["4", "5", "6"],
		["1", "2", "3"],
		["_", "0", "A"],
	];

	return { dPad: mapButtons(directionalPad), numPad: mapButtons(numericalPad) };
}
function mapButtons(keypad: Buttons): ButtonMap {
	const buttonMap: Map<string, Map<string, string>> = new Map();

	function BFS(x: number, y: number): Map<string, string> {
		const queue: State[] = [{ key: keypad[y][x], x, y, path: "", weight: 0 }];
		const routes = new Map();
		const visited = new Set<string>();

		while (queue.length) {
			const { key, x, y, path } = queue.shift()!;
			const coord = `${path.at(-1)},${x},${y}`;

			if (visited.has(coord)) {
				continue;
			} else {
				visited.add(coord);
			}

			visited.add(coord);

			if (!routes.has(key) || path.length < routes.get(key)!.length) {
				routes.set(key, path);
			}

			const neighbours = [
				{ dx: 0, dy: 1, direction: "v" },
				{ dx: 0, dy: -1, direction: "^" },
				{ dx: 1, dy: 0, direction: ">" },
				{ dx: -1, dy: 0, direction: "<" },
			];

			for (const { dx, dy, direction } of neighbours) {
				const [nx, ny] = [dx + x, dy + y];

				if (keypad[ny] && keypad[ny][nx] && keypad[ny][nx] !== "_") {
					const lastDireciton = path.at(-1);

					queue.push({
						key: keypad[ny][nx],
						x: nx,
						y: ny,
						path: path + direction,
						weight: direction === lastDireciton ? -1 : 0,
					});
				}
			}

			queue.sort((a, b) => a.weight - b.weight);
		}

		return routes;
	}

	for (let y = 0; y < keypad.length; y++) {
		for (let x = 0; x < keypad[0].length; x++) {
			const key = keypad[y][x];

			if (key !== "_") {
				buttonMap.set(key, BFS(x, y));
			}
		}
	}

	return buttonMap;
}

function inputCodes(codes: string[]): number {
	const { dPad, numPad } = getButtonMaps();

	const keypads = [
		{ id: 0, key: "A", path: "" },
		{ id: 1, key: "A", path: "" },
		{ id: 2, key: "A", path: "" },
	];

	let complexityScore = 0;

	for (const code of codes) {
		for (const { id, key } of keypads) {
			let sequence = "";
			let currentKey = key;

			if (id === 0) {
				for (const input of code) {
					sequence += numPad.get(currentKey)!.get(input)! + "A";
					currentKey = input;
				}
			} else {
				for (const input of keypads[id - 1].path) {
					sequence += dPad.get(currentKey)!.get(input)! + "A";
					currentKey = input;
				}
			}

			keypads[id] = {
				id,
				key: currentKey,
				path: sequence,
			};
		}

		const codeValue: number = Number(code.slice(0, -1));
		const inputLength: number = keypads[2].path.length;

		console.log({ code, inputLength, codeValue });

		complexityScore += codeValue * inputLength;
	}

	return complexityScore;
}
