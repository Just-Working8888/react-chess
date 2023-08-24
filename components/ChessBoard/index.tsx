import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import { clickHandler } from 'resources/helpers/chessBoardController';
import StatusBar from 'components/StatusBar';
import ChessCell from 'components/ChessCell';
import Colors from 'resources/models/Colors';
import Board from 'resources/models/Board';
import Cell from 'resources/models/Cell';

import css from './index.module.css';

interface TProps {
	board: Board;
	selectedCell: Cell | null;
	setSelectedCell: React.Dispatch<React.SetStateAction<Cell | null>>;

	currentPlayerBadge: React.RefObject<HTMLSpanElement> | null;

	checkmateCheck: () => void;
	swapPlayer: () => void;
}

const ChessBoard: React.FC<TProps> = observer(
	({ board, selectedCell, setSelectedCell, currentPlayerBadge, checkmateCheck, swapPlayer }) => {
		const store = useStore();
		const currentPlayer = store.currentPlayer,
			isGameEnded = store.gameEndStatus,
			isGameStarted = store.gameStartStatus;

		const handleClick = (cell: Cell) => {
			// game start by first click (when game was restarted, but not started yet)
			if (!isGameStarted && !isGameEnded && cell.figure?.color === Colors.WHITE) {
				store.startGame();
			}

			// MOVING TO CELL
			if (selectedCell && selectedCell !== cell && cell.available) {
				clickHandler({
					cell,
					board,
					selectedCell,
					setSelectedCell,
				});

				checkmateCheck(); // checkmate check
				swapPlayer(); // swap player
			} else {
				// PICKING CELL
				if (cell.blocked) return;

				if (cell.figure?.color === currentPlayer?.color) {
					setSelectedCell(cell); // if cell contains figure => change state and select this cell
				}
			}
		};

console.log(board);

		return (
			<>
				<StatusBar currentPlayerBadge={currentPlayerBadge} />

				<div className={css.board}>
					{board.cells.map((row, index) => (
						<React.Fragment key={index}>
							{row.map(cell => (
								<>
								
								<ChessCell
									cell={cell}
									key={cell.id}
									selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y ? true : false}
									click={handleClick}
								/></>
							))}
						</React.Fragment>
					))}
				</div>
			</>
		);
	}
);

export default ChessBoard;
