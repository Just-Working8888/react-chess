import React from 'react';
import Store from 'store';

const StoreContext = React.createContext<Store>({} as Store);
export default StoreContext;
