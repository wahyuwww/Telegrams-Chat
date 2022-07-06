import React from 'react';
import { Provider } from 'react-redux';
import Router from './routers';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}

export default App;
