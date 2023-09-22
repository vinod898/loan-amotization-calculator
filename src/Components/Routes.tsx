import { Route, Routes } from 'react-router-dom';
import SignInSide from './auth/login';
import SignUp from './auth/signup'; // Import your Home component
import Dashboard from './Dashboard';

export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SignInSide />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/dashboard/:param" element={<Dashboard />} />
    {/* Add more routes as needed */}
  </Routes>
);
