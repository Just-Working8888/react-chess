import React, { FormEvent } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';

import Button from 'components/Button/Button';
import css from './index.module.css';

interface ISettingsForm extends HTMLFormElement {
	setTime: HTMLInputElement;
	timerSwitch: HTMLInputElement;
	AISwitch: HTMLInputElement;
}

interface TProps {
	restart: () => void;
}

const SettingsForm: React.FC<TProps> = observer(({ restart }) => {
	const store = useStore();

	const handleSubmit = (event: FormEvent<ISettingsForm>) => {
		event.preventDefault();

		const form = event.target as ISettingsForm;

		const timeValue = +form.setTime.value;
		const checkboxTimerChecked = form.timerSwitch.checked;
		const checkboxAIChecked = form.AISwitch.checked;

		if (checkboxAIChecked) {
			store.switchAiStatus(true);
		} else {
			store.switchAiStatus(false);
		}

		if (checkboxTimerChecked) {
			if (!timeValue || timeValue <= 0) return;
			store.setGameTime(+timeValue);
		} else {
			store.setGameTime(null);
		}

		restart();
	};

	return (
		<details>
			<summary>Настройки</summary>
			<form className={css.settingsForm} onSubmit={handleSubmit}>
				<input type='text' name='setTime' placeholder='Время в секундах' />

				<label>
					<input type='checkbox' name='timerSwitch'></input>
					Включить таймер
				</label>

				<label>
					<input type='checkbox' name='AISwitch'></input>
					Игра с ботом
				</label>

				<Button onSubmit={event => handleSubmit}>Применить настройки</Button>
			</form>
		</details>
	);
});

export default SettingsForm;
