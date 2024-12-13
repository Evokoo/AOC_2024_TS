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
	return 0;
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
function playClawGames(games: ClawGame[]): number {
	let tokens = 0;

	for (let { target, aButton, bButton } of games) {
		// if (target.x % TOOLS.gcd(aButton.x, bButton.x) !== 0) continue;
		// if (target.y % TOOLS.gcd(aButton.y, bButton.y) !== 0) continue;

		const position: Point = { x: 0, y: 0 };

		for (let a = 0; a < 100; a++) {
			position.x = aButton.x * a;
			position.y = aButton.y * a;

			for (let b = 0; b < 100; b++) {
				if (position.x === target.x && position.y === target.y) {
					tokens += a * 3 + b;
				}

				position.x += bButton.x;
				position.y += bButton.y;
			}
		}
	}

	return tokens;
}
