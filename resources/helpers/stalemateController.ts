import { getDeepCopyBoard } from './copyingController';
import Colors from 'resources/models/Colors';
import Board from 'resources/models/Board';
import Cell from 'resources/models/Cell';

const isFigureCanMove = (board: Board): boolean => {
	const cells: Cell[][] = board.cells;

	for (let i = 0; i < cells.length; i++) {
		for (let j = 0; j < cells[i].length; j++) {
			if (board.getCell(i, j).available) {
				return true;
			}
		}
	}
	return false;
};

export const stalemateController = (board: Board, king: Cell): boolean => {
	// return false if king's check confirmed
	if (king.figure?.checked) return false;

	// return true if there are only two kings
	if (board.lostBlackFigures.length === 15 && board.lostWhiteFigures.length === 15) return true;

	const currentColor: Colors = king?.figure?.color as Colors;

	for (let i = 0; i < board.cells.length; i++) {
		for (let j = 0; j < board.cells[i].length; j++) {
			const newPotentialBoard: Board = getDeepCopyBoard(board); // new board
			const kingOfPotentialBoard: Cell = newPotentialBoard.getCell(king.x, king.y); // king of new board
			const checkingCell = newPotentialBoard.getCell(i, j); // cell of new board

			// check availability to move for current cell
			if (checkingCell.figure && checkingCell.figure.color === currentColor) {
				newPotentialBoard.highlightCells(checkingCell, kingOfPotentialBoard);

				if (isFigureCanMove(newPotentialBoard)) {
					return false;
				}
			}
		}
	}

	return true;
};
