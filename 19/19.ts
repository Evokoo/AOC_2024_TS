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
	return 0;
}

type Patterns = {
	available: Set<string>;
	maxLength: number;
};

interface Towels {
	patterns: Patterns;
	designs: string[];
}

type State = {
	original: string;
	current: string;
};

// Functions
function parseInput(data: string): Towels {
	const sections = data.split("\n\n");
	const patterns: Patterns = {
		available: new Set(),
		maxLength: 0,
	};

	for (const pattern of sections[0].match(/\w+/g) || []) {
		if (pattern.length > patterns.maxLength) {
			patterns.maxLength = pattern.length;
		}
		patterns.available.add(pattern);
	}

	return { patterns, designs: sections[1].split("\n") };
}

function validateDesigns({ patterns, designs }: Towels): number {
	const queue: State[] = designs.map((design) => ({
		original: design,
		current: design,
	}));
	const availablePatterns: Set<string> = patterns.available;
	const sliceSize: number = patterns.maxLength;
	const validDesigns: Set<string> = new Set();
	const seen: Map<string, Set<string>> = new Map();

	while (queue.length) {
		const state: State = queue.shift()!;

		if (validDesigns.has(state.original)) {
			continue;
		}

		if (seen.has(state.original)) {
			if (seen.get(state.original)!.has(state.current)) {
				continue;
			} else {
				seen.set(
					state.original,
					new Set([...seen.get(state.original)!, state.current])
				);
			}
		} else {
			seen.set(state.original, new Set([state.current]));
		}

		if (state.current === "") {
			validDesigns.add(state.original);
			continue;
		}

		for (let i = Math.min(sliceSize, state.current.length); i > 0; i--) {
			const slice = state.current.slice(0, i);

			if (availablePatterns.has(slice)) {
				queue.push({ ...state, current: state.current.slice(i) });
			}
		}
	}

	return validDesigns.size;
}
