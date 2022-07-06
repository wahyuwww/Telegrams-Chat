import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Chat from '../pages/Chat';
import Login from '../pages/Login';
import Register from '../pages/Register';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
};

const router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
        </Route>
        <Route path="/register">
          <Route index element={<Register />} />
        </Route>
        <Route path="/chat" element={<PrivateRoute />}>
          <Route index element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default router;
