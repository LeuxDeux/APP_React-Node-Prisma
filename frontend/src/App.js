import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginForm from "./components/LoginForm";
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

          <Route path="/products" element={<PrivateRoute>
            <div> Productos Componente - Solo usuarios autenticados </div>
          </PrivateRoute>} />

          <Route path="/users" element={<PrivateRoute>
            <div> Usuarios Componente - Solo usuarios autenticados </div>
          </PrivateRoute>} />

          <Route path="/" element={<Navigate to="/auth/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
