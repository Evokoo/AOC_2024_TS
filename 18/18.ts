// Imports
import TOOLS from "tools";

//Solutions
export function solveA(
	fileName: string,
	day: string,
	example: boolean
): number {
	const data = TOOLS.readData(fileName, day);
	const bytes: Point[] = parseInput(data);
	const gridSize: number = example ? 6 : 70;
	const byteCount: number = example ? 12 : 1024;
	const { steps }: State = navigateGrid(bytes, byteCount, gridSize);
	return steps;
}
export function solveB(
	fileName: string,
	day: string,
	example: boolean
): string {
	const data = TOOLS.readData(fileName, day);
	const bytes: Point[] = parseInput(data);
	const gridSize: number = example ? 6 : 70;
	const byteCount: number = example ? 12 : 1024;
	return blockingByte(bytes, byteCount, gridSize);
}

type Point = { x: number; y: number };
type State = Point & { steps: number; path: Set<string> };

// Functions
function parseInput(data: string): Point[] {
	const bytes: Point[] = data.split("\n").map((line) => {
		const [x, y] = line.split(",").map(Number);
		return { x, y };
	});

	return bytes;
}
function navigateGrid(
	bytes: Point[],
	byteCount: number,
	gridSize: number
): State {
	const corrupted: Point[] = bytes.slice(0, byteCount);
	const visited: Set<string> = new Set();
	const queue: State[] = [{ x: 0, y: 0, steps: 0, path: new Set() }];

	while (queue.length) {
		const current = queue.shift()!;
		const coord = `${current.x},${current.y}`;

		if (visited.has(coord)) {
			continue;
		} else {
			visited.add(coord);
		}

		if (current.x === gridSize && current.y === gridSize) {
			return current;
		} else {
			for (const [dx, dy] of [
				[0, 1],
				[0, -1],
				[1, 0],
				[-1, 0],
			]) {
				const [nx, ny] = [dx + current.x, dy + current.y];

				if (nx < 0 || nx > gridSize || ny < 0 || ny > gridSize) {
					continue;
				} else if (corrupted.find(({ x, y }) => x === nx && y === ny)) {
					continue;
				} else {
					const pathUpdate = new Set(current.path);
					pathUpdate.add(coord);

					queue.push({
						x: nx,
						y: ny,
						steps: current.steps + 1,
						path: pathUpdate,
					});
				}
			}
		}
	}

	return { x: 0, y: 0, steps: 0, path: new Set() };
}
function blockingByte(
	bytes: Point[],
	byteCount: number,
	gridSize: number
): string {
	let { path }: State = navigateGrid(bytes, byteCount, gridSize);

	for (let i = byteCount; i < bytes.length; i++) {
		const { x, y } = bytes[i];
		const coord = `${x},${y}`;

		if (path.has(coord)) {
			const result: State = navigateGrid(bytes, i + 1, gridSize);

			if (result.steps === 0) {
				return coord;
			} else {
				path = result.path;
			}
		}
	}

	throw Error("Blockage not found");
}
