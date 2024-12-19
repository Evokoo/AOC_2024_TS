import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./19.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(6);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(287);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe(16);
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(571894474468161);
		});
	});
});
