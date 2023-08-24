import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import Colors from 'resources/models/Colors';
import css from './index.module.css';

const Modal: React.FC = observer(() => {
	const store = useStore();
	const currentPlayer = store.currentPlayer,
		isGameEnded = store.gameEndStatus,
		isGameStalemated = store.gameStalemateStatus;

	const [visible, setVisible] = useState(false); // modal visibility state
	const [colorOfWinner, setColorOfWinner] = useState<string>(''); // winner's color

	useEffect(() => {
		if (isGameEnded || isGameStalemated) {
			setColorOfWinner(currentPlayer?.color === Colors.WHITE ? 'чёрным' : 'белым');
			setVisible(true);
			setTimeout(() => setVisible(false), 3000);
		}
	}, [isGameEnded, isGameStalemated]);

	return (
		<div className={visible === true ? css.ModalActive : css.Modal}>
			<div className={css.ModalContent}>
				{isGameStalemated && (
					<span>
						Игра окончилась <b>ничьей</b>!
					</span>
				)}

				{isGameEnded && !isGameStalemated && (
					<span>
						Победа за <b>{`${colorOfWinner}`}</b> игроком!
					</span>
				)}

				{!isGameEnded && !isGameStalemated && <span>Новая игра уже началась!</span>}
			</div>
		</div>
	);
});

export default Modal;
