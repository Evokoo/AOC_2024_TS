// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const reports = parseReports(data);
	return checkReports(reports);
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const reports = parseReports(data);
	return checkReports(reports, true);
}

//Run
// solveA("example_a", "02");

// Functions
function parseReports(input: string): number[][] {
	const reports = input
		.split("\n")
		.map((report) => report.split(" ").map(Number));

	return reports;
}

function checkReports(reports: number[][], partB: boolean = false): number {
	let validReports = 0;

	for (const report of reports) {
		if (report[0] == report[1]) continue;

		const decrease = report[0] > report[1];
		let valid = true;

		for (let i = 1; i < report.length; i++) {
			const a = report[i - 1];
			const b = report[i];

			if (
				(decrease && a - b < 0) ||
				(!decrease && a - b > 0) ||
				a - b == 0 ||
				Math.abs(a - b) > 3
			) {
				valid = false;
				break;
			}
		}

		if (valid) {
			validReports++;
		}
	}

	return validReports;
}
