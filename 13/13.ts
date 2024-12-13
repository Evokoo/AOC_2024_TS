// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const clawGames: ClawGame[] = parseInput(data);
	return playClawGames(clawGames);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const clawGames: ClawGame[] = parseInput(data);
	return playClawGames(clawGames, true);
}

type Point = { x: number; y: number };

interface ClawGame {
	position: Point;
	aButton: Point;
	bButton: Point;
	target: Point;
}

// Functions
function parseInput(data: string): ClawGame[] {
	const clawGames: ClawGame[] = [];
	const lines = data.split("\n");

	for (let i = 0; i < lines.length; i += 4) {
		const details = lines
			.slice(i, i + 4)
			.map((detail) => detail.match(/(?<=[XY][+=])\d+/g) || []);

		clawGames.push({
			position: { x: 0, y: 0 },
			aButton: { x: +details[0][0], y: +details[0][1] },
			bButton: { x: +details[1][0], y: +details[1][1] },
			target: { x: +details[2][0], y: +details[2][1] },
		});
	}

	return clawGames;
}
function playClawGames(games: ClawGame[], extend: boolean = false): number {
	let tokens = 0;

	for (const { aButton: a, bButton: b, target: t } of games) {
		if (extend) {
			t.x += 10000000000000;
			t.y += 10000000000000;
		}

		const [nA, nB] = countButtonPresses(a, b, t);

		tokens += nA * 3 + nB;
	}

	return tokens;
}
function countButtonPresses(
	A: Point,
	B: Point,
	target: Point
): [number, number] {
	const { x: xA, y: yA } = A;
	const { x: xB, y: yB } = B;
	const { x: xT, y: yT } = target;

	const det = xA * yB - yA * xB;

	if (det === 0) {
		throw Error("No unique solution exists");
	}

	const detA = xT * yB - yT * xB;
	const detB = xA * yT - yA * xT;

	const a = detA / det;
	const b = detB / det;

	if (Number.isInteger(a) && Number.isInteger(b)) {
		return [a, b];
	} else {
		return [0, 0];
	}
}
