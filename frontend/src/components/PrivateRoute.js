import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

//Recibe children que es el componente que se quiere renderizar si el usuario está autenticado.
const PrivateRoute = ({ children }) => {
    //Lee el estado de autenticación y carga desde el contexto de autenticación.
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
  //Si está autenticado, renderiza los children (el componente protegido).
  //Si no está autenticado, redirige al usuario a la página de login.
};

export default PrivateRoute;
