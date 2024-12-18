import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./18.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay, true)).toBe(22);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay, false)).toBe(264);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay, true)).toBe("6,1");
		});

		it("Solution", () => {
			expect(solveB("input", currentDay, false)).toBe("41,26");
		});
	});
});
