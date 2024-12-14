import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./14.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay, { x: 11, y: 7 })).toBe(12);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay, { x: 101, y: 103 })).toBe(218295000);
		});
	});

	describe("Part B", () => {
		it.skip("Example", () => {
			expect(solveB("example_b", currentDay, { x: 11, y: 7 })).toBe(0);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay, { x: 101, y: 103 })).toBe(6870);
		});
	});
});
