export type Registers = { a: bigint; b: bigint; c: bigint };
export interface IntcodeSetup {
	registers: Registers;
	program: number[];
}

/**
 * Intcode Computer Class
 */

export class Intcode {
	private registerA: bigint;
	private registerB: bigint;
	private registerC: bigint;
	private pointer: bigint;
	private movePointer: boolean;
	private output: bigint[];

	constructor(a: bigint, b: bigint, c: bigint) {
		this.registerA = a;
		this.registerB = b;
		this.registerC = c;
		this.pointer = 0n;
		this.output = [];
		this.movePointer = true;
	}

	public exercute(code: number, operand: number): void {
		const literal: bigint = BigInt(operand);

		switch (code) {
			case 0:
				this.adv(literal);
				break;
			case 1:
				this.bxl(literal);
				break;
			case 2:
				this.bst(literal);
				break;
			case 3:
				this.jnz(literal);
				break;
			case 4:
				this.bxc(literal);
				break;
			case 5:
				this.out(literal);
				break;
			case 6:
				this.bdv(literal);
				break;
			case 7:
				this.cdv(literal);
				break;
		}

		this.updatePointer();
	}

	//Update Pointer
	private updatePointer(increment: bigint = 2n): void {
		if (this.movePointer) {
			this.pointer += increment;
		} else {
			this.movePointer = true;
		}
	}

	//Divsion
	private dv(combo: bigint): bigint {
		const numerator: bigint = this.registerA;
		const denominator: bigint = 2n ** combo;
		const result: bigint = numerator / denominator;
		return result;
	}

	//Get Combocode
	private getComboCode(literal: bigint): bigint {
		let combo: bigint = literal;

		if (literal > 3n) {
			switch (literal) {
				case 4n:
					combo = this.registerA;
					break;
				case 5n:
					combo = this.registerB;
					break;
				case 6n:
					combo = this.registerC;
					break;
				case 7n:
					throw Error("Reserved code");
				default:
					throw RangeError(`code: ${combo} not found`);
			}
		}
		return combo;
	}

	//Code 0
	private adv(literal: bigint): void {
		const combo = this.getComboCode(literal);
		this.registerA = this.dv(combo);
	}

	//Code 1
	private bxl(literal: bigint): void {
		const result = this.registerB ^ literal;
		this.registerB = result;
	}

	//Code 2
	private bst(literal: bigint): void {
		const combo = this.getComboCode(literal);
		const result = combo % 8n;
		this.registerB = result;
	}

	//Code 3
	private jnz(literal: bigint): void {
		if (this.registerA !== 0n) {
			this.movePointer = false;
			this.pointer = literal;
		}
	}

	//Code 4
	private bxc(_literal: bigint): void {
		const result = this.registerB ^ this.registerC;
		this.registerB = result;
	}

	//Code 5
	private out(literal: bigint): void {
		const combo = this.getComboCode(literal);
		const result = combo % 8n;
		this.output.push(result);
	}

	//Code 6
	private bdv(literal: bigint): void {
		const combo = this.getComboCode(literal);
		this.registerB = this.dv(combo);
	}

	//Code 7
	private cdv(literal: bigint): void {
		const combo = this.getComboCode(literal);
		this.registerC = this.dv(combo);
	}

	get registers(): Registers {
		return { a: this.registerA, b: this.registerB, c: this.registerC };
	}

	get printResult(): bigint[] {
		return this.output;
	}

	get pointerIndex(): number {
		return Number(this.pointer);
	}
}
