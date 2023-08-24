import { Figure, FigureName } from './Figure';
import Cell from 'resources/models/Cell';
import Colors from 'resources/models/Colors';

import blackLogo from 'assets/black-king.png';
import whiteLogo from 'assets/white-king.png';

export default class King extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.name = FigureName.KING;
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;

		this.checked = false;
	}

	canMove(target: Cell): boolean {
		if (!super.canMove(target, target.board)) {
			return false;
		}

		// if difference between X and Y coords is less than or equal to 1 = TRUE
		if (Math.abs(this.cell.x - target.x) <= 1 && Math.abs(this.cell.y - target.y) <= 1) {
			return true;
		}

		return false;
	}
}
