import Board from 'resources/models/Board';
import Colors from 'resources/models/Colors';
import { Figure } from './figures/Figure';

export default class Cell {
	// cell coordinates
	readonly x: number;
	readonly y: number;
	readonly color: Colors;
	id: number;
	figure: Figure | null;
	board: Board;

	available: boolean; // to stand on cell
	blocked: boolean; // block possibility to click on cell

	constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
		this.x = x;
		this.y = y;
		this.color = color;

		this.figure = figure;
		this.board = board;

		this.available = false;
		this.blocked = false;
		this.id = Math.random();
	}

	isEmpty(): boolean {
		// TRUE = empty cell, FALSE = cell with figure
		return this.figure === null;
	}

	isEnemy(target: Cell): boolean {
		// if target cell contains figure
		if (target.figure) {
			// and that figure is enemy figure = TRUE
			return this.figure?.color !== target.figure.color;
		}
		// else = FALSE
		return false;
	}

	isEmptyVertical(target: Cell): boolean {
		// if x coord is different = do not highlight
		if (this.x !== target.x) {
			return false;
		}

		const min = Math.min(this.y, target.y);
		const max = Math.max(this.y, target.y);

		// + 1 implements highlighting of figure closest to the empty vertical
		for (let y = min + 1; y < max; y++) {
			// if some cell in vertical contains figure
			if (!this.board.getCell(this.x, y).isEmpty()) {
				// vertical is not empty = do not highlight target cell
				return false;
			}
		}

		// if there is no one figure = vertical is empty = highlight target cell
		return true;
	}

	isEmptyHorizontal(target: Cell): boolean {
		// if x coord is different = do not highlight
		if (this.y !== target.y) {
			return false;
		}

		const min = Math.min(this.x, target.x);
		const max = Math.max(this.x, target.x);

		// + 1 implements highlighting of figure closest to the empty horizontal
		for (let x = min + 1; x < max; x++) {
			// if some cell in horizontal contains figure
			if (!this.board.getCell(x, this.y).isEmpty()) {
				// horizontal is not empty = do not highlight target cell
				return false;
			}
		}

		// if there is no one figure = horizontal is empty = highlight target cell
		return true;
	}

	isEmptyDiagonal(target: Cell): boolean {
		// save spacing
		const absX = Math.abs(target.x - this.x);
		const absY = Math.abs(target.y - this.y);

		// if spacing is not equal = cell is not from diagonal
		if (absX !== absY) {
			return false;
		}

		// saving direction
		const dy = this.y < target.y ? 1 : -1;
		const dx = this.x < target.x ? 1 : -1;

		for (let i = 1; i < absY; i++) {
			// if some cell in diagonal contains figure
			if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) {
				// diagonal is not empty = do not highlight target cell
				return false;
			}
		}

		return true;
	}

	setFigure(figure: Figure) {
		// add figure to cell
		this.figure = figure;
		// add cell (this) to figure of new cell (this)
		this.figure.cell = this;
	}

	forceMove(target: Cell) {
		if (this.figure) {
			this.figure.moveFigure(target);

			target.setFigure(this.figure);
			this.figure = null;
		}
	}

	moveFigure(target: Cell) {
		if (this.figure && this.figure?.canMove(target, target.board)) {
			// moving figure
			this.figure.moveFigure(target);

			// beating enemy's figure
			if (target.figure) {
				this.board.addLostFigure(target.figure);
			}

			// add figure to new cell
			target.setFigure(this.figure);

			// delete figure on old cell
			this.figure = null;
		}
	}
}
