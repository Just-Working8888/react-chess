import { FigureName } from 'resources/models/figures/Figure';
import Colors from 'resources/models/Colors';
import Board from 'resources/models/Board';
import Cell from 'resources/models/Cell';

interface IClickHandlerParams {
	cell: Cell;
	board: Board;

	selectedCell: Cell | null;
	setSelectedCell: React.Dispatch<React.SetStateAction<Cell | null>>;
}

// CELL CLICK HANDLER
export const clickHandler = ({ cell, board, selectedCell, setSelectedCell }: IClickHandlerParams) => {
	if (selectedCell) {
		// MOVES HANDLER
		if (
			selectedCell.figure?.name === FigureName.KING &&
			cell.figure?.name === FigureName.ROOK &&
			selectedCell.figure.color === cell.figure.color
		) {
			// castles
			handleCastle(board, selectedCell, cell);
		} else {
			// check state rewriting for kings to false
			if (!!board.whiteKing && board.whiteKing.figure) board.whiteKing.figure.checked = false;
			if (!!board.blackKing && board.blackKing.figure) board.blackKing.figure.checked = false;

			// common move
			selectedCell.moveFigure(cell);

			if (cell.figure?.name === FigureName.KING) {
				if (cell.figure.color === Colors.WHITE) {
					board.whiteKing = cell;
				} else if (cell.figure.color === Colors.BLACK) {
					board.blackKing = cell;
				}
			}

			// special moves checks
			castleActivityCheck(board, selectedCell, cell);
			enPassantCheck(board, selectedCell, cell);
		}

		setSelectedCell(null);
	}
};

// CASTLING HANDLER
const handleCastle = (board: Board, king: Cell, rook: Cell) => {
	const color = king.figure?.color as Colors;

	if (rook.x === 0) {
		// left rook
		const newKingPosition = board.getCell(king.x - 2, king.y);
		rook.forceMove(board.getCell(king.x - 1, king.y));
		king.forceMove(newKingPosition);
		newKingPosition.figure?.color === Colors.WHITE
			? (board.whiteKing = newKingPosition)
			: (board.blackKing = newKingPosition);
	} else if (rook.x === 7) {
		// right rook
		const newKingPosition = board.getCell(king.x + 2, king.y);
		rook.forceMove(board.getCell(king.x + 1, king.y));
		king.forceMove(newKingPosition);
		newKingPosition.figure?.color === Colors.WHITE
			? (board.whiteKing = newKingPosition)
			: (board.blackKing = newKingPosition);
	}

	// lock castles for this color
	blockCastlesForColor(board, color);
};

// block castling for one side
const blockCastlesForColor = (board: Board, color: Colors) => {
	board.blockCastlesForColor(color);
};

// check possibilities for castling
const castleActivityCheck = (board: Board, from: Cell, to: Cell) => {
	board.castleActivityCheck(from, to);
};

// check possibilities for beat pawn en passant
const enPassantCheck = (board: Board, from: Cell, to: Cell) => {
	board.enPassantCheck(from, to);
};
