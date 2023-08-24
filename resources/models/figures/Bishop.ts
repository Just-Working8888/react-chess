import { Figure, FigureName } from './Figure';
import Cell from 'resources/models/Cell';
import Colors from 'resources/models/Colors';

import blackLogo from 'assets/black-bishop.png';
import whiteLogo from 'assets/white-bishop.png';

export default class Bishop extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.name = FigureName.BISHOP;
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
	}

	canMove(target: Cell): boolean {
		if (!super.canMove(target, target.board)) {
			return false;
		}

		// diagonal available cells to move
		if (this.cell.isEmptyDiagonal(target)) {
			return true;
		}

		return false;
	}
}
