// import Sidebar from './components/Sidebar/Sidebar'
// import { Routes, Route } from "react-router";
// import Add from './pages/Add/Add'
// import List from './pages/List/List'
// import Orders from './pages/Orders/Orders'
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const App = () => {

//   const url = "http://localhost:4000"
//   return (
//     <div>
// <ToastContainer/>
{
  /* <Navbar/> */
}
{
  /* <hr/> */
}
{
  /* <div className="app-content">
        <Sidebar/>
        <Routes>
      <Route path="/add" element={<Add url={url}/>} />
      <Route path="/list" element={<List url={url}/>} />
      <Route path="/orders" element={<Orders url={url}/>} />
    </Routes>
      </div>
    </div>
  )
}

export default App */
}

// src/App.jsx
import Sidebar from "./components/Sidebar/Sidebar";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { ALLOWED_EMAILS } from "./authConfig";

import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import Logout from "./pages/Auth/Logout";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const isAllowed = !!user && ALLOWED_EMAILS.includes(user.email || "");
  return (
    <div className="app-content">
      {isAllowed ? <Sidebar /> : null}
      {children}
    </div>
  );
};

const RequireAllowed = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!ALLOWED_EMAILS.includes(user.email || "")) {
    return <div style={{ color: "white", padding: 24 }}>Access denied.</div>;
  }
  return children;
};

const App = () => {
  const url = "http://localhost:4000";

  return (
    <AuthProvider>
      <ToastContainer />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Admin protected routes */}

        <Route
          path="/dashboard"
          element={
            <RequireAllowed>
              <AdminLayout>
                <Dashboard url={url} />
              </AdminLayout>
            </RequireAllowed>
          }
        />
        <Route
          path="/add"
          element={
            <RequireAllowed>
              <AdminLayout>
                <Add url={url} />
              </AdminLayout>
            </RequireAllowed>
          }
        />
        <Route
          path="/list"
          element={
            <RequireAllowed>
              <AdminLayout>
                <List url={url} />
              </AdminLayout>
            </RequireAllowed>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAllowed>
              <AdminLayout>
                <Orders url={url} />
              </AdminLayout>
            </RequireAllowed>
          }
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
