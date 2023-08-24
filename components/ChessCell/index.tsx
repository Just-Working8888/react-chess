import React from 'react';
import Cell from 'resources/models/Cell';

import css from './index.module.css';
import Colors from 'resources/models/Colors';

interface CellProps {
	cell: Cell;
	selected: boolean;
	click: (cell: Cell) => void;
}

const ChessCell: React.FC<CellProps> = ({ cell, selected, click }) => {

	
	return (
		<div
			className={[
				css.cell,
				cell.color === Colors.WHITE ? css.white : css.black,
				selected ? css.selected : ''
			].join(' ')}
			onClick={() => click(cell)}
			// green background if cell contains figure and is available to move
			style={{
				background: cell.available && cell.figure ? 'rgb(82, 177, 82)' : '',
				boxShadow: cell.figure?.checked === true ? 'inset 0 0 25px red' : '',
			}}>
			{/* green marks of availability to move */}
			{cell.available && !cell.figure && <div className={css.available} />}

			{/* figures render */}
			{cell.figure?.logo && <img src={cell.figure.logo} alt='' />}
		</div>
	);
};

export default ChessCell;
