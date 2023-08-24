import React, { useEffect } from 'react';
import { useStore } from 'store';

import css from './index.module.css';

interface TProps {
	currentPlayerBadge: React.RefObject<HTMLSpanElement> | null;
}

const StatusBar: React.FC<TProps> = ({ currentPlayerBadge }) => {
	const store = useStore();
	const currentPlayer = store.currentPlayer;
	const isGameStarted = store.gameStartStatus;

	// FLIP BADGE
	useEffect(() => {
		if (!isGameStarted) return;

		if (currentPlayerBadge?.current?.classList.contains('flipped')) {
			currentPlayerBadge.current.classList.remove('flipped');
		} else {
			currentPlayerBadge?.current?.classList.add('flipped');
		}
	}, [currentPlayer]);

	return (
		<section className={css.currentPlayerStatus}>
			Сейчас ходит
			<div className={css.flipper}>
				<span className={css.flipperObject} ref={currentPlayerBadge}>
					<span className={css.panelFront}>белый</span>
					<span className={css.panelBack}>чёрный</span>
				</span>
			</div>
			игрок
		</section>
	);
};

export default StatusBar;
