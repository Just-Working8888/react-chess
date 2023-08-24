import { Figure, FigureName } from './Figure';
import Cell from 'resources/models/Cell';
import Colors from 'resources/models/Colors';

import blackLogo from 'assets/black-knight.png';
import whiteLogo from 'assets/white-knight.png';

export default class Knight extends Figure {
	constructor(color: Colors, cell: Cell) {
		super(color, cell);
		this.name = FigureName.KNIGHT;
		this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
	}

	canMove(target: Cell): boolean {
		if (!super.canMove(target, target.board)) {
			return false;
		}

		const deltaX = Math.abs(this.cell.x - target.x);
		const deltaY = Math.abs(this.cell.y - target.y);

		return (deltaX === 1 && deltaY === 2) || (deltaX === 2 && deltaY === 1);
	}
}
