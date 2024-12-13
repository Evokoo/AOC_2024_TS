import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./13.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(480);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(36954);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(875318608908);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(79352015273424);
		});
	});
});
