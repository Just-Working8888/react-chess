import { Figure, FigureName } from './Figure';
import Cell from 'resources/models/Cell';
import Colors from 'resources/models/Colors';

import blackLogo from 'assets/black-queen.png';
import whiteLogo from 'assets/white-queen.png';

export default class Queen extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.name = FigureName.QUEEN;
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
	}

	canMove(target: Cell): boolean {
		if (!super.canMove(target, target.board)) {
			return false;
		}

		// vertical available cells to move
		if (this.cell.isEmptyVertical(target)) {
			return true;
		}

		// vertical available cells to move
		if (this.cell.isEmptyHorizontal(target)) {
			return true;
		}

		// diagonal available cells to move
		if (this.cell.isEmptyDiagonal(target)) {
			return true;
		}

		return false;
	}
}
