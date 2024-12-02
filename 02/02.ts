// Imports
import TOOLS from "tools";

//Solutions
export function solveA(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const reports = parseReports(data);
	const safeReports = findSafeReports(reports);
	return safeReports.size;
}
export function solveB(fileName: string, day: string): number {
	const data = TOOLS.readData(fileName, day);
	const reports = parseReports(data);
	const safeReports = findSafeReports(reports, true);
	return safeReports.size;
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

function findSafeReports(
	reports: number[][],
	problemDampener: boolean = false
): Set<number> {
	const safeReports: Set<number> = new Set();

	for (const [ID, report] of reports.entries()) {
		if (
			isSafeReport(report) ||
			(problemDampener && runProblemDampener(report))
		) {
			safeReports.add(ID);
		}
	}

	return safeReports;
}

function isSafeReport(report: number[]): boolean {
	for (let i = 1, currentDirection = undefined; i < report.length; i++) {
		const reportA = report[i - 1];
		const reportB = report[i];
		const difference = reportA - reportB;
		const direction = difference > 0 ? -1 : 1;

		if (difference === 0 || Math.abs(difference) > 3) {
			return false;
		}

		if (!currentDirection) {
			currentDirection = direction;
		} else {
			if (currentDirection !== direction) {
				return false;
			}
		}
	}
	return true;
}

function runProblemDampener(report: number[]): boolean {
	for (let i = 0; i < report.length; i++) {
		const modifiedReport = [...report.slice(0, i), ...report.slice(i + 1)];
		if (isSafeReport(modifiedReport)) return true;
	}
	return false;
}
