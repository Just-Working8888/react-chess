import { Figure, FigureName } from './Figure';
import Colors from 'resources/models/Colors';
import Cell from 'resources/models/Cell';
import Board from '../Board';

import blackLogo from 'assets/black-pawn.png';
import whiteLogo from 'assets/white-pawn.png';

export default class Pawn extends Figure {
	isFirstStep: boolean = true;

	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.name = FigureName.PAWN;
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
	}

	canMove(target: Cell, board: Board): boolean {
		if (!super.canMove(target, board)) {
			return false;
		}

		// pawn possible moves and directions depending on the color
		const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
		const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

		// pawn's step
		if (
			target.y === this.cell.y + direction &&
			target.x === this.cell.x &&
			this.cell.board.getCell(target.x, target.y).isEmpty()
		) {
			return true;
		}

		// pawn's first step
		if (
			this.isFirstStep &&
			target.y === this.cell.y + firstStepDirection &&
			target.x === this.cell.x &&
			this.cell.board.getCell(this.cell.x, this.cell.y + direction).isEmpty() &&
			this.cell.board.getCell(target.x, target.y).isEmpty()
		) {
			return true;
		}

		// if target Y coord = cell Y +/- 1 AND target X coord = +- X cell coord
		// AND on target cell is staying enemy figure
		if (
			target.y === this.cell.y + direction &&
			(target.x === this.cell.x + 1 || target.x === this.cell.x - 1) &&
			(this.cell.isEnemy(target) ||
				(target.x === board.enPassant?.target.x &&
					target.y === board.enPassant?.target.y &&
					this.color !== board.enPassant.pawn.figure?.color))
		) {
			return true;
		}

		return false;
	}

	moveFigure(target: Cell) {
		super.moveFigure(target);
		this.isFirstStep = false;
	}
}
