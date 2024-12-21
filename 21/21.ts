// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const codes: string[] = parseInput(data);
	return inputCodes(codes);
	// return inputCodes(codes);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	return 0;
}

// type Point = { x: number; y: number };
type Buttons = string[][];
// type ButtonMap = Map<string, Map<string, string[]>>;
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

		const output: string[] = [];

		while (queue.length) {
			const { input, key, path, depth } = queue.pop()!;
			const currentInput = input[0];

			if (input === "") {
				if (depth === 0) {
					output.push(path);
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

		return output.sort((a, b) => a.length - b.length)[0];
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

// function findOptimalPath(paths: string[]) {
// 	const directionMap: Map<string, Map<string, string[]>> = new Map();

// 	function DFS(path: string) {
// 		const queue = [{ path, route: "", currentKey: "A" }];
// 		const possiblePaths = [];

// 		while (queue.length) {
// 			const { path, route, currentKey } = queue.pop()!;

// 			if (path === "") {
// 				possiblePaths.push(route);
// 			} else {
// 				const input = path[0];
// 				const branches =
// 					directionMap.get(currentKey)?.get(input) ??
// 					getPaths(currentKey, input, DPAD);

// 				for (const branch of branches) {
// 					queue.push({
// 						path: path.slice(1),
// 						route: route + branch,
// 						currentKey: input,
// 					});
// 				}

// 				if (
// 					directionMap.has(currentKey) &&
// 					directionMap.get(currentKey)!.has(input)
// 				) {
// 					continue;
// 				} else {
// 					directionMap.set(currentKey, new Map([[input, branches]]));
// 				}
// 			}
// 		}

// 		return possiblePaths;
// 	}

// 	let opitmalPath: string = "";

// 	for (const path of paths) {
// 		for (const result of DFS(path)) {
// 			opitmalPath =
// 				opitmalPath === "" || opitmalPath.length > result.length
// 					? result
// 					: opitmalPath;
// 		}
// 	}

// 	return opitmalPath;
// }

// function inputCodes(codes: string[]) {
// 	const keypads = [
// 		{ id: 0, key: "A", path: "" },
// 		{ id: 1, key: "A", path: "" },
// 		{ id: 2, key: "A", path: "" },
// 	];

// 	let complexityScore = 0;

// 	for (const code of codes.slice(2, 3)) {
// 		for (const { id, key } of keypads) {
// 			let currentKey = key;
// 			let sequence = "";

// 			if (id === 0) {
// 				for (const input of code) {
// 					const paths = getPaths(currentKey, input, NUMPAD).sort(
// 						(a, b) => findOptimalPath([a]).length - findOptimalPath([b]).length
// 					);

// 					currentKey = input;
// 					sequence += paths[0];
// 				}
// 			} else {
// 				for (const input of keypads[id - 1].path) {
// 					const paths = getPaths(currentKey, input, DPAD).sort(
// 						(a, b) => findOptimalPath([a]).length - findOptimalPath([b]).length
// 					);

// 					currentKey = input;
// 					sequence += paths[0];
// 				}
// 			}

// 			keypads[id] = {
// 				id,
// 				key: currentKey,
// 				path: sequence,
// 			};
// 		}

// 		const codeValue = Number(code.slice(0, -1));
// 		const inputLength = keypads[2].path.length;

// 		console.log({ code, codeValue, inputLength });

// 		complexityScore += codeValue * inputLength;
// 	}

// 	console.log(keypads, complexityScore);
// }
