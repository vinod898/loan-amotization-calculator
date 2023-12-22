import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { HashRouter as Router } from 'react-router-dom';
import  {AppRoutes}  from './Components/Routes'; // 0
import { ThemeProvider, createTheme } from '@mui/material/styles'; // Import ThemeProvider and createTheme

const theme = createTheme();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <ThemeProvider theme={theme}>
      <Router basename='/'>
        <AppRoutes />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);

reportWebVitals();

