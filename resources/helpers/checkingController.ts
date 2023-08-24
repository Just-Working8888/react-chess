import { getDeepCopyBoard } from './copyingController';
import Colors from 'resources/models/Colors';
import Board from 'resources/models/Board';
import Cell from 'resources/models/Cell';

export const checkingController = (board: Board, selectedCell: Cell, kingCell: Cell, x: number, y: number): boolean => {
	if (selectedCell.figure && kingCell.figure) {
		// create copies with new board context
		const newPotentialBoard: Board = getDeepCopyBoard(board); // new board
		const cellsOfPotentialBoard: Cell[][] = newPotentialBoard.cells; // board cells
		const currentCell = newPotentialBoard.getCell(selectedCell.x, selectedCell.y); // selected cell

		currentCell.moveFigure(newPotentialBoard.getCell(x, y)); // move selected cell to (x, y) position

		// get king position
		const newPotentialKingCell =
			selectedCell.figure.name === kingCell.figure.name && selectedCell.figure.color === kingCell.figure.color
				? newPotentialBoard.getCell(x, y)
				: newPotentialBoard.getCell(kingCell.x, kingCell.y);

		// check danger for king after move
		if (!newPotentialBoard.isKingInDanger(newPotentialKingCell, cellsOfPotentialBoard)) {
			return false;
		}
	}

	return true;
};

export const isCellIsSafe = (board: Board, cell: Cell, currentColor: Colors): boolean => {
	const newPotentialBoard: Board = getDeepCopyBoard(board); // new board
	const currentCell = newPotentialBoard.getCell(cell.x, cell.y); // selected cell

	for (let i = 0; i < board.cells.length; i++) {
		for (let j = 0; j < board.cells[i].length; j++) {
			const cellOfPotentialBoard = newPotentialBoard.getCell(i, j);

			if (
				cellOfPotentialBoard.figure &&
				cellOfPotentialBoard.figure.color !== currentColor &&
				cellOfPotentialBoard.figure.canMove(currentCell, newPotentialBoard)
			) {
				return false;
			}
		}
	}

	return true;
};
