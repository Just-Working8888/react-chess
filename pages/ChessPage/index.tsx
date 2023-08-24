import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStore } from "store";

import Colors from "resources/models/Colors";
import Player from "resources/models/Player";
import Board from "resources/models/Board";

import BoxContainer from "components/BoxContainer";
import SettingsForm from "components/SettingsForm";
import GameBoard from "components/GameBoard";
import Timer from "components/Timer";
import Modal from "components/Modal";

const ChessPage: React.FC = observer(() => {
  // store
  const store = useStore();
  const currentPlayer = store.currentPlayer;

  const [board, setBoard] = useState(new Board()); // game board state
console.log(board);

  // players states
  const [whitePlayer, setWhitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer, setBlackPlayer] = useState(new Player(Colors.BLACK));

  const currentPlayerBadge = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    restart();
  }, []);
  function restart() {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);

    store.setCurrentPlayer(whitePlayer);
    store.restartGame();
    currentPlayerBadge?.current?.classList.remove("flipped");
  }

  function swapPlayer() {
    store.setCurrentPlayer(
      currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer
    );
  }

  return (
    <main>
      <SettingsForm restart={restart} />

      <GameBoard
        board={board}
        setBoard={setBoard}
        swapPlayer={swapPlayer}
        currentPlayerBadge={currentPlayerBadge}
      />
      <Timer restart={restart} />

      <div>
        <h3>Побеждённые фигуры</h3>
        <div className="lost-figures">
          <BoxContainer title={"Чёрные"} figures={board.lostBlackFigures} />
          <BoxContainer title={"Белые"} figures={board.lostWhiteFigures} />
        </div>
      </div>

      <Modal />
    </main>
  );
});

export default ChessPage;
