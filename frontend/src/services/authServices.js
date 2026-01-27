import api from './api';

//Básicamente loginUser() hace una petición POST a la ruta 'auth/login' del backend con el nombre de usuario y la contraseña proporcionados.
//Si la respuesta es exitosa y contiene un token, guarda ese token en el almacenamiento local (localStorage) y devuelve los datos de la respuesta.
//AuthContext guarda este token y lo usa para determinar si el usuario está autenticado.
//El usuario podrá acceder a rutas protegidas en el frontend mientras el token sea válido.
const authServices = {
  loginUser: async (username, password) => {
    try {
        // Realizar la solicitud de login al backend
      const response = await api.post('auth/login', { username, password });
      // Recibe el token como respuesta y lo guarda en el almacenamiento local
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token);
        return response.data;
      }
      throw new Error(response.data.error || 'Login failed');
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Validar token con el backend y obtener datos del usuario
  validateToken: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      // Llamar al backend para validar el token
      const response = await api.get('auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.user;
      }
      throw new Error('Token validation failed');
    } catch (error) {
      // Si el token es inválido, eliminarlo
      localStorage.removeItem('token');
      throw error;
    }
  },
};

export default authServices;
