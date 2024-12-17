export type Registers = { a: number; b: number; c: number };

export class Intcode {
	private registerA: number;
	private registerB: number;
	private registerC: number;
	private pointer: number;
	private movePointer: boolean;
	private output: number[];

	constructor(a: number, b: number, c: number) {
		this.registerA = a;
		this.registerB = b;
		this.registerC = c;
		this.pointer = 0;
		this.output = [];
		this.movePointer = true;
	}

	public exercute(code: number, operand: number): void {
		switch (code) {
			case 0:
				this.adv(operand);
				break;
			case 1:
				this.bxl(operand);
				break;
			case 2:
				this.bst(operand);
				break;
			case 3:
				this.jnz(operand);
				break;
			case 4:
				this.bxc(operand);
				break;
			case 5:
				this.out(operand);
				break;
			case 6:
				this.bdv(operand);
				break;
			case 7:
				this.cdv(operand);
				break;
		}

		this.updatePointer();
	}

	//Update Pointer
	private updatePointer(increment: number = 2): void {
		if (this.movePointer) {
			this.pointer += increment;
		} else {
			this.movePointer = true;
		}
	}

	//Divsion
	private dv(combo: number): number {
		const numerator: number = this.registerA;
		const denominator: number = Math.pow(2, combo);
		const result: number = Number(Math.trunc(numerator / denominator));
		return result;
	}

	//Get Combocode
	private getComboCode(literal: number, combo: number = literal): number {
		if (literal > 3) {
			switch (literal) {
				case 4:
					combo = this.registerA;
					break;
				case 5:
					combo = this.registerB;
					break;
				case 6:
					combo = this.registerC;
					break;
				case 7:
					throw Error("Reserved code");
				default:
					throw RangeError(`code: ${combo} not found`);
			}
		}
		return combo;
	}

	//Code 0
	private adv(literal: number): void {
		const combo = this.getComboCode(literal);
		this.registerA = this.dv(combo);
	}

	//Code 1
	private bxl(literal: number): void {
		const result = this.registerB ^ literal;
		this.registerB = result;
	}

	//Code 2
	private bst(literal: number): void {
		const combo = this.getComboCode(literal);
		const result: number = combo % 8;
		this.registerB = result;
	}

	//Code 3
	private jnz(literal: number): void {
		if (this.registerA !== 0) {
			this.movePointer = false;
			this.pointer = literal;
		}
	}

	//Code 4
	private bxc(_literal: number): void {
		const result: number = this.registerB ^ this.registerC;
		this.registerB = result;
	}

	//Code 5
	private out(literal: number): void {
		const combo = this.getComboCode(literal);
		const result: number = combo % 8;
		this.output.push(result);
	}

	//Code 6
	private bdv(literal: number): void {
		const combo = this.getComboCode(literal);
		this.registerB = this.dv(combo);
	}

	//Code 7
	private cdv(literal: number): void {
		const combo = this.getComboCode(literal);
		this.registerC = this.dv(combo);
	}

	get registers(): Registers {
		return { a: this.registerA, b: this.registerB, c: this.registerC };
	}

	get printResult(): number[] {
		return this.output;
	}

	get pointerIndex(): number {
		return this.pointer;
	}
}
