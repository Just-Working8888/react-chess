import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { clickHandler } from 'resources/helpers/chessBoardController';
import Colors from 'resources/models/Colors';
import Board from 'resources/models/Board';
import Cell from 'resources/models/Cell';
import ChessBoard from 'components/ChessBoard';

interface TProps {
	board: Board;
	setBoard: (board: Board) => void;
	swapPlayer: () => void;
	currentPlayerBadge: React.RefObject<HTMLSpanElement> | null;
}

const GameBoard: React.FC<TProps> = observer(({ board, setBoard, swapPlayer, currentPlayerBadge }) => {
	const store = useStore();
	const currentPlayer = store.currentPlayer,
		isGameEnded = store.gameEndStatus,
		isGameStarted = store.gameStartStatus,
		aiStatus = store.aiStatus;

	const [selectedCell, setSelectedCell] = useState<Cell | null>(null); // selected cell state

	const aiPickingTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
	const aiMovingTimer = useRef<null | ReturnType<typeof setTimeout>>(null);

	// HIGHLIGHTING
	useEffect(() => {
		if (board.blackKing && board.whiteKing) {
			const currentPlayerKing = currentPlayer?.color === Colors.WHITE ? board.whiteKing : board.blackKing;
			highlightCells(currentPlayerKing);
		}
	}, [selectedCell]);

	// GAME END
	useEffect(() => {
		if (!isGameEnded) return;
		if (aiPickingTimer.current) clearTimeout(aiPickingTimer.current);
		if (aiMovingTimer.current) clearTimeout(aiMovingTimer.current);
		setSelectedCell(null);
		blockCells();
	}, [isGameEnded]);

	// GAME STALEMATE & AI MOVE
	useEffect(() => {
		if (isGameStarted && stalemateCheck()) {
			store.setGameStalemate();
			store.setGameEnd();
		}
		if (aiStatus && currentPlayer?.color === Colors.BLACK) {
			aiMove();
		}
	}, [currentPlayer]);

	useEffect(() => {
		if (!isGameStarted) {
			setSelectedCell(null);
		}
	}, [isGameStarted]);

	const aiMove = () => {
		const { selectedCell, cell } = board.aiMove();

		if (selectedCell === null && cell === null) {
			store.setGameEnd();
		} else {
			aiPickingTimer.current = setTimeout(() => setSelectedCell(selectedCell), 1000);

			aiMovingTimer.current = setTimeout(() => {
				clickHandler({
					cell,
					board,
					selectedCell,
					setSelectedCell,
				});

				updateBoard();
				checkmateCheck();
				swapPlayer();
			}, 2000);
		}
	};

	const checkmateCheck = () => {
		const isCheckmated = board.checkmateCheck();
		if (isCheckmated) store.setGameEnd();
	};

	const highlightCells = (currentPlayerKing: Cell) => {
		board.highlightCells(selectedCell, currentPlayerKing);
		updateBoard();
	};

	const stalemateCheck = () => {
		if (currentPlayer) {
			return board.isGameStalemated(
				currentPlayer.color === Colors.WHITE ? (board.whiteKing as Cell) : (board.blackKing as Cell)
			);
		}
	};

	const updateBoard = () => {
		const newBoard = board.getCopyBoard();
		setBoard(newBoard);
	};

	const blockCells = () => board.blockCells();

	return (
		<ChessBoard
			board={board}
			selectedCell={selectedCell}
			setSelectedCell={setSelectedCell}
			currentPlayerBadge={currentPlayerBadge}
			checkmateCheck={checkmateCheck}
			swapPlayer={swapPlayer}
		/>
	);
});

export default GameBoard;
