import logo from "./logo.svg";
import "./App.css";
import { AuthProvider } from "./context/AuthContext";
import { PrivateRoute } from "./components/PrivateRoute";
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
          <Route path="/login" element={<div> Login de Componente </div>} />

          <Route path="/products" element={<PrivateRoute>
            <div> Productos Componente - Solo usuarios autenticados </div>
          </PrivateRoute>} />

          <Route path="/users" element={<PrivateRoute>
            <div> Usuarios Componente - Solo usuarios autenticados </div>
          </PrivateRoute>} />

          <Route path="/" element={<Navigate to="/login" />} />

          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <p>
                Edit <code>src/App.js</code> and save to reload.
              </p>
              <a
                className="App-link"
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn React
              </a>
            </header>
          </div>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
