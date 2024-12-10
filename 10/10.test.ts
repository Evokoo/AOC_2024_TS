import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./10.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe.skip("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(36);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(512);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(81);
		});

		it.ignore("Solution", () => {
			expect(solveB("input", currentDay)).toBe(0);
		});
	});
});
