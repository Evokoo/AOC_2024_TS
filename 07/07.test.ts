import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./07.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(3749);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(5512534574980);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(11387);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(328790210468594);
		});
	});
});
