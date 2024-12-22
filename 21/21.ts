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
type State = {
	key: string;
	x: number;
	y: number;
	path: string;
};

const DPAD: Buttons = [
	["_", "^", "A"],
	["<", "v", ">"],
];
const NUMPAD: Buttons = [
	["7", "8", "9"],
	["4", "5", "6"],
	["1", "2", "3"],
	["_", "0", "A"],
];

// Functions
function parseInput(data: string): string[] {
	return data.split("\n");
}
function getPaths(start: string, end: string, keypad: Buttons): string[] {
	function BFS(x: number, y: number): string[] {
		const queue: State[] = [{ key: keypad[y][x], x, y, path: "" }];
		const visited: Map<string, number> = new Map();
		const paths: string[] = [];

		while (queue.length) {
			const { key, x, y, path } = queue.shift()!;

			if (visited.has(key) && visited.get(key)! < path.length) {
				continue;
			} else {
				visited.set(key, path.length);
			}

			if (key === end) {
				paths.push(path + "A");
			} else {
				const neighbours = [
					{ dx: 1, dy: 0, direction: ">" },
					{ dx: -1, dy: 0, direction: "<" },
					{ dx: 0, dy: 1, direction: "v" },
					{ dx: 0, dy: -1, direction: "^" },
				];

				for (const { dx, dy, direction } of neighbours) {
					const [nx, ny] = [dx + x, dy + y];

					if (keypad[ny] && keypad[ny][nx] && keypad[ny][nx] !== "_") {
						queue.push({
							key: keypad[ny][nx],
							x: nx,
							y: ny,
							path: path + direction,
						});
					}
				}
			}
		}

		return paths;
	}

	for (let y = 0; y < keypad.length; y++) {
		for (let x = 0; x < keypad[0].length; x++) {
			if (keypad[y][x] === start) {
				return BFS(x, y);
			}
		}
	}

	throw Error("Paths not found");
}
function inputCodes(codes: string[]): number {
	const branchMap: Map<string, string[]> = new Map();

	function DFS(target: string, currentKey: string, maxDepth: number) {
		const queue = getPaths(currentKey, target, NUMPAD).map((input) => ({
			input,
			key: "A",
			path: "",
			depth: maxDepth,
		}));

		const output: { path: string; size: number } = {
			path: "",
			size: Infinity,
		};

		while (queue.length) {
			const { input, key, path, depth } = queue.pop()!;
			const currentInput = input[0];

			if (path.length > output.size) {
				continue;
			}

			if (input === "") {
				if (depth === 0) {
					if (path.length < output.size) {
						output.path = path;
						output.size = path.length;
					}
				} else {
					queue.push({
						input: path,
						key: "A",
						path: "",
						depth: depth - 1,
					});
				}
				continue;
			}

			const branchCode: string = `${key}->${currentInput}`;
			const branches: string[] =
				branchMap.get(branchCode) ?? getPaths(key, currentInput, DPAD);

			for (const branch of branches) {
				queue.push({
					input: input.slice(1),
					key: currentInput,
					path: path + branch,
					depth,
				});
			}

			branchMap.set(branchCode, branches);
		}

		return output.path;
	}

	let complexityScore = 0;

	for (const code of codes) {
		let currentKey = "A";
		let inputs = "";

		for (const input of code) {
			inputs += DFS(input, currentKey, 1);
			currentKey = input;
		}

		complexityScore += Number(code.slice(0, -1)) * inputs.length;
	}

	return complexityScore;
}
