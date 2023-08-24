import React from 'react';
import css from './Button.module.css';

interface ButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
	onSubmit?: (event: any) => void;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, onSubmit }) => {
	return (
		<button
			className={css.button}
			onClick={onClick ? () => onClick() : () => {}}
			onSubmit={onSubmit ? event => onSubmit(event) : () => {}}>
			{children}
		</button>
	);
};

export default Button;
