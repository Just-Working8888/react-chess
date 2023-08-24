import Cell from 'resources/models/Cell';
import Colors from 'resources/models/Colors';
import logo from 'assets/black-king.png';
import Board from '../Board';

export enum FigureName {
	FIGURE = 'Фигура',
	KING = 'Король',
	KNIGHT = 'Конь',
	PAWN = 'Пешка',
	QUEEN = 'Ферзь',
	ROOK = 'Ладья',
	BISHOP = 'Слон',
}

export class Figure {
	color: Colors;
	logo: typeof logo | null;
	cell: Cell;
	name: FigureName;
	id: number;
	checked?: boolean;

	constructor(color: Colors, cell: Cell) {
		this.color = color;
		this.cell = cell;

		// adding figure on cell
		this.cell.figure = this;

		this.logo = null;
		this.name = FigureName.FIGURE;

		this.id = Math.random();
	}

	canMove(target: Cell, board: Board): boolean {
		// self figure beating prevention
		if (target.figure?.color === this.color) return false;
		return true;
	}

	moveFigure(target: Cell) {}
}
