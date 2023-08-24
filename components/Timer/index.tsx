import React, { useState, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import Button from 'components/Button/Button';
import Colors from 'resources/models/Colors';
import css from './index.module.css';

interface TimerProps {
	restart: () => void;
}

const Timer: React.FC<TimerProps> = observer(({ restart }) => {
	const store = useStore();
	const gameTime = store.gameTime,
		currentPlayer = store.currentPlayer,
		isGameStarted = store.gameStartStatus,
		isGameEnded = store.gameEndStatus;

	const [blackTime, setBlackTime] = useState<number | null>(gameTime);
	const [whiteTime, setWhiteTime] = useState<number | null>(gameTime);

	const timer = useRef<null | ReturnType<typeof setInterval>>(null);

	// TIME CHANGING
	useEffect(() => {
		if (isGameStarted) return;
		setBlackTime(gameTime);
		setWhiteTime(gameTime);
	}, [gameTime]);

	// SWAP TIMER
	useEffect(() => {
		if (gameTime && isGameStarted) startTimer();
	}, [currentPlayer, isGameStarted]);

	// STOP TIMER AFTER END OF GAME
	useEffect(() => {
		if (timer.current) clearInterval(timer.current);
	}, [isGameEnded]);

	// TIME OVER
	useEffect(() => {
		if (whiteTime === 0 || blackTime === 0) {
			store.setGameEnd();
		}
	}, [whiteTime, blackTime]);

	const startTimer = () => {
		if (timer.current) clearInterval(timer.current); // stopping timer for player
		const callback = currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer; // picking current timer
		timer.current = setInterval(callback, 1000); // start new timer
	};

	const decrementBlackTimer = () => {
		setBlackTime(prev => (prev ? prev - 1 : null));
	};

	const decrementWhiteTimer = () => {
		setWhiteTime(prev => (prev ? prev - 1 : null));
	};

	const handleRestart = () => {
		setBlackTime(gameTime);
		setWhiteTime(gameTime);
		if (timer.current) clearInterval(timer.current);

		restart();
	};

	return (
		<section className={css.timer}>
			<Button onClick={handleRestart}>Новая игра</Button>
			{gameTime && (
				<div className={css.time}>
					<h2>
						Чёрные: <span>{blackTime}</span>
					</h2>
					<h2>
						Белые: <span>{whiteTime}</span>
					</h2>
				</div>
			)}
		</section>
	);
});

export default Timer;
