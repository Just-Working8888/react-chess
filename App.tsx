import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Layout from 'components/Layout';

import ChessPage from 'pages/ChessPage';
import './styles/index.css';

const App: React.FC = () => {
	return (
		<Routes>
			<Route path='/' element={<Layout />}>
				<Route index element={<ChessPage />} />
		
			</Route>
		</Routes>
	);
};

export default App;
