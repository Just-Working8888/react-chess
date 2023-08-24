import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Store from 'store';
import StoreContext from './context';

const store = new Store();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<StoreContext.Provider value={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</StoreContext.Provider>
);
