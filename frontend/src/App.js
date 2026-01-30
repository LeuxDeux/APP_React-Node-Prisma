import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";


function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />

          <Route path="/dashboard" element={<PrivateRoute>
            <Dashboard />
          </PrivateRoute>} />

          <Route path="/products" element={<PrivateRoute>
            <ProductList />
          </PrivateRoute>} />

          <Route path="/users" element={<PrivateRoute>
            <div> Usuarios Componente Users - Solo usuarios autenticados </div>
          </PrivateRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
