import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store'; // 
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import  {AppRoutes}  from './Components/Routes'; // 0
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme

const theme = createTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <React.StrictMode>
    <ThemeProvider theme={theme}>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </React.StrictMode>
  </Provider>
);

reportWebVitals();

