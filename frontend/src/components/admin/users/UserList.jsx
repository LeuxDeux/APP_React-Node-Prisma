import React, { useState } from "react"; // Ya no necesitamos useEffect aquí
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import "./UserList.css";
// import { usersAPI } ... Ya no se usa directamente aquí, lo maneja el hook
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

  // 5. RENDERIZADO (Early Returns)
  // Nota: Mantenemos loading bloqueante solo si NO hay modal abierto
  if (loading && !showForm) return <div className="loading-msg">Cargando usuarios...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;

  return (
    <div className="user-list-container">
      {/* Encabezado */}
      <div className="user-list-header">
        <button
          className="btn btn-back"
          onClick={handleBack}
          title="Volver al Dashboard"
        >
          ← Atrás
        </button>
        <h1 className="header-title">Gestión de Usuarios</h1>
        <button className="btn btn-new-user" onClick={handleNewUser}>
          + Nuevo Usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="users-table-wrapper">
        {users.length > 0 ? (
          <table className="users-table">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-users">No hay usuarios registrados</p>
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