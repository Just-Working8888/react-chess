import { checkingController, isCellIsSafe } from 'resources/helpers/checkingController';
import { stalemateController } from 'resources/helpers/stalemateController';
import { Figure, FigureName } from './figures/Figure';
import Colors from 'resources/models/Colors';
import Cell from 'resources/models/Cell';

import Knight from 'resources/models/figures/Knight';
import Bishop from 'resources/models/figures/Bishop';
import Queen from 'resources/models/figures/Queen';
import Pawn from 'resources/models/figures/Pawn';
import King from 'resources/models/figures/King';
import Rook from 'resources/models/figures/Rook';
import { getDeepCopyBoard } from 'resources/helpers/copyingController';

interface ICastle {
	withLeftRook: boolean;
	withRightRook: boolean;
}

interface IEnPassant {
	pawn: Cell;
	target: Cell;
}

class Board {
	// cells grid
	cells: Cell[][] = [];

	// lost figures
	lostBlackFigures: Figure[] = [];
	lostWhiteFigures: Figure[] = [];

	// kings cells
	whiteKing: Cell | undefined = undefined;
	blackKing: Cell | undefined = undefined;

	// castles possibilities
	whiteCastle: ICastle = {
		withLeftRook: true,
		withRightRook: true,
	};

	blackCastle: ICastle = {
		withLeftRook: true,
		withRightRook: true,
	};

	enPassant: IEnPassant | undefined = undefined;

	public initCells() {
		for (let i = 0; i < 8; i++) {
			const row: Cell[] = [];
			for (let j = 0; j < 8; j++) {
				if ((i + j) % 2 !== 0) {
					row.push(new Cell(this, j, i, Colors.BLACK, null)); // black cells
				} else {
					row.push(new Cell(this, j, i, Colors.WHITE, null)); // white cells
				}
			}
			this.cells.push(row); // row pushing
		}
	}

	public getCell(x: number, y: number) {
		return this.cells[y][x];
	}

	// create and return copy of this board
	public getCopyBoard(): Board {
		const newBoard = new Board();
		newBoard.cells = this.cells;

		newBoard.lostBlackFigures = this.lostBlackFigures;
		newBoard.lostWhiteFigures = this.lostWhiteFigures;

		newBoard.whiteKing = this.whiteKing;
		newBoard.blackKing = this.blackKing;

		newBoard.whiteCastle = this.whiteCastle;
		newBoard.blackCastle = this.blackCastle;

		newBoard.enPassant = this.enPassant;

		return newBoard;
	}

	public checkmateCheck(): boolean {
		this.unblockCells();

		// check if kings are in danger
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				const cell = this.getCell(i, j);

				// white king checking
				if (this.whiteKing && cell.figure?.canMove(this.whiteKing, this)) {
					this.blockCells();
					if (!!this.whiteKing.figure) this.whiteKing.figure.checked = true; // mark the check
				}

				// black king checking
				if (this.blackKing && cell.figure?.canMove(this.blackKing, this)) {
					this.blockCells();
					if (!!this.blackKing.figure) this.blackKing.figure.checked = true; // mark the check
				}
			}
		}

		// checking end of the game for checked king
		if (this.whiteKing?.figure?.checked && this.checkEndgame(this.whiteKing)) {
			return true;
		}

		if (this.blackKing?.figure?.checked && this.checkEndgame(this.blackKing)) {
			return true;
		}

		return false;
	}

	public isKingInDanger(king: Cell, cells: Cell[][]): boolean {
		for (let i = 0; i < cells.length; i++) {
			for (let j = 0; j < cells[i].length; j++) {
				if (cells[j][i].figure?.canMove(king, this)) {
					return true;
				}
			}
		}
		return false;
	}

	public checkEndgame(king: Cell): boolean | void {
		let isGameEnded = true;
		const cellsToEscape: Cell[] = []; // array with all cells to escape for king

		if (this.lostBlackFigures.length === 15 || this.lostWhiteFigures.length === 15) {
			return isGameEnded;
		}

		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				let x = king.x + i;
				let y = king.y + j;
				if (x >= 0 && x < 8 && y >= 0 && y < 8) {
					// if cell exists on board and
					if (
						this.cells[y][x].figure === null || // if cell is empty
						this.cells[y][x].figure?.color !== king.figure?.color // or occupied by opponent
					) {
						cellsToEscape.push(this.getCell(x, y)); // push cell to array of variants for escaping
					}
				}
			}
		}

		// checking variants when king can escape
		for (let cellToEscape of cellsToEscape) {
			const isKingInDangerAfterMove = checkingController(this, king, king, cellToEscape.x, cellToEscape.y);

			if (!isKingInDangerAfterMove) {
				king.blocked = false;
				isGameEnded = false;
			}
		}

		// checking variants when the king can be covered by friendly figure
		// OR
		// variants when a dangerous figure can be defeated
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				const cell = this.getCell(i, j);
				if (cell.figure && cell.figure.color === king.figure?.color) {
					// if cell contains friendly figure => iterate all possible figure moves
					if (this.isFigureMoveCanCoverCheck(cell, king)) {
						cell.blocked = false;
						isGameEnded = false;
					}
				}
			}
		}

		return isGameEnded;
	}

	public isFigureMoveCanCoverCheck(cell: Cell, king: Cell): boolean {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 8; j++) {
				const target = this.getCell(i, j);
				if (!cell.figure?.canMove(target, this)) continue;
				const isKingInDangerAfterMove = checkingController(this, cell, king, i, j);
				if (!isKingInDangerAfterMove) {
					return true;
				}
			}
		}
		return false;
	}

	public isGameStalemated(currentPlayerKing: Cell) {
		return stalemateController(this, currentPlayerKing);
	}

	public blockCells() {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.getCell(i, j).blocked = true;
			}
		}
	}

	public unblockCells() {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.getCell(i, j).blocked = false;
			}
		}
	}

	public turnOffAvailabilityOfCells() {
		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				this.getCell(i, j).available = false;
			}
		}
	}

	public checkPossibilityToCastle(king: Cell) {
		const leftCell = this.getCell(king.x - 1, king.y);
		const rightCell = this.getCell(king.x + 1, king.y);

		const newKingLeftPosition = this.getCell(king.x - 2, king.y);
		const newKingRightPosition = this.getCell(king.x + 2, king.y);

		// WHITE CASTLES
		if (king.figure?.name === FigureName.KING && king.figure?.color === Colors.WHITE) {
			const leftRook = this.getCell(0, 7);
			const rightRook = this.getCell(7, 7);

			if (
				this.whiteCastle.withLeftRook &&
				leftCell.available &&
				this.getCell(1, 7).isEmpty() &&
				this.getCell(2, 7).isEmpty() &&
				this.getCell(3, 7).isEmpty() &&
				isCellIsSafe(this, newKingLeftPosition, Colors.WHITE)
			) {
				leftRook.available = true;
			}

			if (
				this.whiteCastle.withRightRook &&
				rightCell.available &&
				this.getCell(5, 7).isEmpty() &&
				this.getCell(6, 7).isEmpty() &&
				isCellIsSafe(this, newKingRightPosition, Colors.WHITE)
			) {
				rightRook.available = true;
			}

			// BLACK CASTLES
		} else if (king.figure?.name === FigureName.KING && king.figure?.color === Colors.BLACK) {
			const leftRook = this.getCell(0, 0);
			const rightRook = this.getCell(7, 0);

			if (
				this.blackCastle.withLeftRook &&
				leftCell.available &&
				this.getCell(1, 0).isEmpty() &&
				this.getCell(2, 0).isEmpty() &&
				this.getCell(3, 0).isEmpty() &&
				isCellIsSafe(this, newKingLeftPosition, Colors.BLACK)
			) {
				leftRook.available = true;
			}

			if (
				this.blackCastle.withRightRook &&
				rightCell.available &&
				this.getCell(5, 0).isEmpty() &&
				this.getCell(6, 0).isEmpty() &&
				isCellIsSafe(this, newKingRightPosition, Colors.BLACK)
			) {
				rightRook.available = true;
			}
		}
	}

	public castleActivityCheck(from: Cell, to: Cell) {
		const colorOfMovedCell = to.figure?.color as Colors;

		if (to.figure?.name === FigureName.KING) {
			this.blockCastlesForColor(colorOfMovedCell);
		}

		if (to.figure?.name === FigureName.ROOK) {
			if (colorOfMovedCell === Colors.WHITE) {
				if (from.x === 0) {
					this.whiteCastle.withLeftRook = false;
				} else {
					this.whiteCastle.withRightRook = false;
				}
			} else if (colorOfMovedCell === Colors.BLACK) {
				if (from.x === 0) {
					this.blackCastle.withLeftRook = false;
				} else {
					this.blackCastle.withRightRook = false;
				}
			}
		}
	}

	public blockCastlesForColor(color: Colors) {
		if (color === Colors.WHITE) {
			this.whiteCastle.withLeftRook = false;
			this.whiteCastle.withRightRook = false;
		} else if (color === Colors.BLACK) {
			this.blackCastle.withLeftRook = false;
			this.blackCastle.withRightRook = false;
		}
	}

	public enPassantCheck(cellFrom: Cell, cellTo: Cell) {
		if (this.enPassant && cellFrom.figure?.name === FigureName.PAWN && cellTo === this.enPassant.target) {
			this.addLostFigure(this.enPassant.pawn.figure as Figure); // beating pawn en passant
			this.enPassant.pawn.figure = null; // delete figure on new cell

			cellTo.figure = cellFrom.figure; // set pawn to new position
			if (cellTo.figure) cellTo.figure.cell = cellTo;
			cellFrom.figure = null; // delete figure on old cell
		}

		// reset en passant of last turn
		if (this.enPassant !== undefined) {
			this.enPassant = undefined;
		}

		if (cellTo.figure?.name === FigureName.PAWN && Math.abs(cellFrom.y - cellTo.y) === 2) {
			const target =
				cellTo.figure.color === Colors.WHITE
					? this.getCell(cellFrom.x, cellFrom.y - 1)
					: this.getCell(cellFrom.x, cellFrom.y + 1);
			this.enPassant = {
				pawn: cellTo,
				target: target,
			};
		}
	}

	public highlightCells(selectedCell: Cell | null, currentPlayerKing: Cell) {
		this.turnOffAvailabilityOfCells();
		let isKingInDangerAfterMove;

		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				const target = this.getCell(i, j);
				if (selectedCell) isKingInDangerAfterMove = checkingController(this, selectedCell, currentPlayerKing, i, j);

				// if check is active => highlight only check preventing cells
				if (currentPlayerKing.figure?.checked && selectedCell?.figure?.canMove(target, this)) {
					if (!isKingInDangerAfterMove) {
						target.available = true;
					}
				} else {
					// else highlight target if this move will not bring check
					if (!isKingInDangerAfterMove) {
						target.available = !!selectedCell?.figure?.canMove(target, this);
					}
				}
			}
		}

		// castle highlight
		if (selectedCell?.figure?.name === FigureName.KING && !selectedCell.figure.checked) {
			this.checkPossibilityToCastle(selectedCell);
		}
	}

	public addLostFigure(figure: Figure) {
		figure.color === Colors.BLACK ? this.lostBlackFigures.push(figure) : this.lostWhiteFigures.push(figure);
	}

	public aiMove() {
		const kingCell = this.blackKing as Cell;
		const blackFiguresList: Cell[] = []; // THIS

		for (let i = 0; i < this.cells.length; i++) {
			for (let j = 0; j < this.cells[i].length; j++) {
				const cell = this.getCell(i, j);
				if (cell.figure && cell.figure.color === Colors.BLACK) {
					blackFiguresList.push(cell);
				}
			}
		}

		let index;

		while (blackFiguresList.length) {
			const availableList: Cell[] = [];

			const newPotentialBoard: Board = getDeepCopyBoard(this); // new board

			index = Math.floor(Math.random() * blackFiguresList.length);
			const randomSelectedCell = newPotentialBoard.getCell(blackFiguresList[index].x, blackFiguresList[index].y); // COPY
			const blackPlayerKing = newPotentialBoard.getCell(kingCell?.x, kingCell?.y); // COPY
			newPotentialBoard.highlightCells(randomSelectedCell, blackPlayerKing); // COPY

			blackFiguresList.splice(index, 1);

			for (let i = 0; i < newPotentialBoard.cells.length; i++) {
				for (let j = 0; j < newPotentialBoard.cells[i].length; j++) {
					const cell = newPotentialBoard.getCell(i, j);
					if (cell.available && cell !== randomSelectedCell) availableList.push(cell);
				}
			}

			if (availableList.length) {
				index = Math.floor(Math.random() * availableList.length);

				const selectedCell = this.getCell(randomSelectedCell.x, randomSelectedCell.y);
				const cell = this.getCell(availableList[index].x, availableList[index].y);

				return {
					selectedCell: selectedCell,
					cell: cell,
				};
			}
		}

		return {
			selectedCell: null,
			cell: null,
		};
	}

	// adding figures methods
	private addPawns() {
		for (let i = 0; i < 8; i++) {
			new Pawn(Colors.BLACK, this.getCell(i, 1));
			new Pawn(Colors.WHITE, this.getCell(i, 6));
		}
	}

	private addKings() {
		let blackKing = new King(Colors.BLACK, this.getCell(4, 0));
		let whiteKing = new King(Colors.WHITE, this.getCell(4, 7));

		// save positions of kings
		this.whiteKing = whiteKing.cell;
		this.blackKing = blackKing.cell;
	}

	private addQueens() {
		new Queen(Colors.BLACK, this.getCell(3, 0));
		new Queen(Colors.WHITE, this.getCell(3, 7));
	}

	private addBishops() {
		new Bishop(Colors.BLACK, this.getCell(2, 0));
		new Bishop(Colors.BLACK, this.getCell(5, 0));
		new Bishop(Colors.WHITE, this.getCell(2, 7));
		new Bishop(Colors.WHITE, this.getCell(5, 7));
	}

	private addKnights() {
		new Knight(Colors.BLACK, this.getCell(1, 0));
		new Knight(Colors.BLACK, this.getCell(6, 0));
		new Knight(Colors.WHITE, this.getCell(1, 7));
		new Knight(Colors.WHITE, this.getCell(6, 7));
	}

	private addRooks() {
		new Rook(Colors.BLACK, this.getCell(0, 0));
		new Rook(Colors.BLACK, this.getCell(7, 0));
		new Rook(Colors.WHITE, this.getCell(0, 7));
		new Rook(Colors.WHITE, this.getCell(7, 7));
	}

	public addFigures() {
		this.addPawns();
		this.addKings();
		this.addQueens();
		this.addBishops();
		this.addKnights();
		this.addRooks();
	}
}

export default Board;
