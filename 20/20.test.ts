import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./20.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it.skip("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(0);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(1411);
		});
	});

	describe("Part B", () => {
		it.skip("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(0);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(1010263);
		});
	});
});
