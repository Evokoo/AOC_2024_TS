import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./11.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(55312);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(188902);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(22938365706844);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(223894720281135);
		});
	});
});
