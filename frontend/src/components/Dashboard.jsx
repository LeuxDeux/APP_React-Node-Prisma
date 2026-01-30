import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.username}</p>
      
      <button onClick={() => navigate('/products')}>
        Ir a Productos
      </button>
      
      <button onClick={() => navigate('/users')}>
        Ir a Usuarios
      </button>
      
      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
