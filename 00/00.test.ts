import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./00.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(0);
		});

		it.ignore("Solution", () => {
			expect(solveA("input", currentDay)).toBe(0);
		});
	});

	describe.ignore("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(0);
		});

		it.ignore("Solution", () => {
			expect(solveB("input", currentDay)).toBe(0);
		});
	});
});
