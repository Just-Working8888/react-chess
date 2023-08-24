import Board from 'resources/models/Board';
import { FigureName } from 'resources/models/figures/Figure';

import Knight from 'resources/models/figures/Knight';
import Bishop from 'resources/models/figures/Bishop';
import Pawn from 'resources/models/figures/Pawn';
import King from 'resources/models/figures/King';
import Rook from 'resources/models/figures/Rook';
import Queen from 'resources/models/figures/Queen';

export const getDeepCopyBoard = (board: Board): Board => {
	const copyBoard = new Board();
	copyBoard.initCells();

	for (let i = 0; i < copyBoard.cells.length; i++) {
		for (let j = 0; j < copyBoard.cells[i].length; j++) {
			const currentCell = board.getCell(i, j);
			const figureColor = currentCell.figure?.color;

			if (figureColor) {
				switch (currentCell.figure?.name) {
					case FigureName.BISHOP:
						new Bishop(figureColor, copyBoard.getCell(i, j));
						break;

					case FigureName.KING:
						const king = new King(figureColor, copyBoard.getCell(i, j));
						king.checked = (currentCell.figure as King).checked;
						break;

					case FigureName.KNIGHT:
						new Knight(figureColor, copyBoard.getCell(i, j));
						break;

					case FigureName.PAWN:
						const pawn = new Pawn(figureColor, copyBoard.getCell(i, j));
						pawn.isFirstStep = (currentCell.figure as Pawn).isFirstStep;
						break;

					case FigureName.QUEEN:
						new Queen(figureColor, copyBoard.getCell(i, j));
						break;

					case FigureName.ROOK:
						new Rook(figureColor, copyBoard.getCell(i, j));
						break;
				}
			}
		}
	}

	if (board.whiteKing && board.blackKing) {
		const whiteKing = copyBoard.getCell(board.whiteKing?.x, board.whiteKing?.y);
		const blackKing = copyBoard.getCell(board.blackKing?.x, board.blackKing?.y);

		copyBoard.whiteKing = whiteKing;
		copyBoard.blackKing = blackKing;
	}

	if (board.enPassant) {
		const pawn = board.enPassant.pawn;
		const target = board.enPassant.target;

		copyBoard.enPassant = {
			pawn: copyBoard.getCell(pawn.x, pawn.y),
			target: copyBoard.getCell(target.x, target.y),
		};
	} else {
		copyBoard.enPassant = undefined;
	}

	if (board.whiteCastle && board.blackCastle) {
		const whiteCastle = board.whiteCastle;
		const blackCastle = board.blackCastle;

		copyBoard.whiteCastle = {
			withLeftRook: whiteCastle.withLeftRook,
			withRightRook: whiteCastle.withRightRook,
		};

		copyBoard.blackCastle = {
			withLeftRook: blackCastle.withLeftRook,
			withRightRook: blackCastle.withRightRook,
		};
	}

	return copyBoard;
};
