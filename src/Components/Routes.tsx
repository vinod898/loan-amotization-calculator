import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignInSide from './login';
import SignUp from './signup'; // Import your Home component
import Dashboard from './Dashboard';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SignInSide />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/dashboard/:param" element={<Dashboard />} />
    {/* Add more routes as needed */}
  </Routes>
);
