import * as path from "@std/path";
import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { solveA, solveB } from "./23.ts";

const currentDay = path.basename(Deno.cwd());

describe(`AOC 2024 - Day ${currentDay}`, () => {
	describe("Part A", () => {
		it("Example", () => {
			expect(solveA("example_a", currentDay)).toBe(7);
		});

		it("Solution", () => {
			expect(solveA("input", currentDay)).toBe(1119);
		});
	});

	describe("Part B", () => {
		it("Example", () => {
			expect(solveB("example_b", currentDay)).toBe("co,de,ka,ta");
		});

		it("Solution", () => {
			expect(solveB("input", currentDay)).toBe(
				"av,fr,gj,hk,ii,je,jo,lq,ny,qd,uq,wq,xc"
			);
		});
	});
});
