import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./09.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(1928);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(6430446922192);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(2858);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(6460170593016);
		});
	});
});