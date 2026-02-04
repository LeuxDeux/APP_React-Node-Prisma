import { useState, useEffect } from "react"; // Ya no necesitamos useEffect aquí
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import UserForm from "./UserForm";
import "../common/styles/ListStyles.css";
import { usersAPI } from "../../../services/usersServices"; 
import { useFetch } from "../../../hooks/useFetch"; // Importamos el hook

const UserList = () => {
  // 1. DATA FETCHING (Delegado al Hook)
  // 'refetch' es la función que usaremos para recargar la tabla tras crear/editar
  const { data, loading, error, refetch } = useFetch("/users");

  // 2. ESTADOS DEL MODAL (Esto sí es responsabilidad de la UI local)
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const navigate = useNavigate();

  // 3. PROCESAMIENTO DE DATOS
  // Su API devuelve { users: [...] }, así que extraemos el array de forma segura
  const users = data?.users || [];

  // 4. MANEJADORES (Handlers)
  const handleBack = () => navigate("/dashboard");

  const handleNewUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

   const handleDeleteUser = async (id) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
          await usersAPI.deleteUserByID(id);
          refetch();
        } catch (err) {
          console.error("Error deleting:", err);
          alert("Error al eliminar usuario");
        }
      }
    };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  // LÓGICA CLAVE: Actualización
  const handleFormSuccess = () => {
    handleCloseForm();
    refetch(); // <-- ¡MAGIA! Aquí obligamos al hook a pedir los datos de nuevo
  };

  // EFECTO DE WEBSOCKET
  useEffect(() => {
    // 1. Conectamos al servidor
    const socket = io("http://localhost:5000"); // URL de su Backend

    // 2. Escuchamos el evento
    socket.on("server:users_updated", () => {
      console.log("¡Cambio detectado! Recargando lista...");
      refetch(); // <-- La magia: vuelve a pedir los datos a la API
    });

    // 3. Limpieza (Cleanup): Desconectamos al salir de la pantalla
    return () => {
      socket.disconnect();
    };
  }, [refetch]); // Dependencia: refetch

  // 5. RENDERIZADO (Early Returns)
  // Nota: Mantenemos loading bloqueante solo si NO hay modal abierto
  if (loading && !showForm)
    return <div className="loading-msg">Cargando usuarios...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;

  return (
    <div className="list-container">
      {/* Encabezado */}
      <div className="list-header">
        <button
          className="btn btn-back"
          onClick={handleBack}
          title="Volver al Dashboard"
        >
          ← Atrás
        </button>
        <h1 className="list-title">Gestión de Usuarios</h1>
        <button className="btn btn-new" onClick={handleNewUser}>
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        {users.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre de Usuario</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.address || "-"}</td>
                  <td>{user.phonenumber || "-"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`role-badge role-${user.role?.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEdit(user)}
                      title="Editar usuario"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteUser(user.id)}
                      title="Eliminar usuario"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-items">No hay usuarios registrados</p>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm
              userToEdit={editingUser}
              onSuccess={handleFormSuccess}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
