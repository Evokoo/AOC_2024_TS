// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const { patterns, designs }: Towels = parseInput(data);
	return validateDesigns({ patterns, designs });
}

export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const { patterns, designs }: Towels = parseInput(data);
	return validateDesigns({ patterns, designs }, true);
}

interface Towels {
	patterns: string[];
	designs: string[];
}

// Functions
function parseInput(data: string): Towels {
	const sections = data.split("\n\n");
	return {
		patterns: sections[0].match(/\w+/g) || [],
		designs: sections[1].split("\n"),
	};
}

function validateDesigns(
	{ patterns, designs }: Towels,
	combinations: boolean = false
): number {
	const memo: Map<string, number> = new Map([["", 1]]);

	function DFS(target: string, count: number = 0): number {
		if (memo.has(target)) {
			return memo.get(target)!;
		}

		for (const pattern of patterns) {
			const len: number = pattern.length;

			if (target.slice(0, len) === pattern) {
				count += DFS(target.slice(len));
			}
		}

		memo.set(target, count);
		return count;
	}

	if (combinations) {
		return designs.reduce((acc, cur) => acc + DFS(cur), 0);
	} else {
		return designs.map((design) => DFS(design)).filter(Boolean).length;
	}
}
