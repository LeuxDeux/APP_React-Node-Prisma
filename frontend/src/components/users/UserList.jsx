import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserForm from "./UserForm";
import "./UserList.css";
import { usersAPI } from "../../services/usersServices";

const UserList = () => {
  // 1. ESTADOS DE DATOS Y UI
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. ESTADOS DEL MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // null = Crear, Objeto = Editar

  const navigate = useNavigate();

  // 3. LÓGICA DE FETCH (Traer datos)
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersAPI.getAllUsers();

        setUsers(response.data.users);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      const errorMsg =
        err.error || err.message || "Error desconocido al obtener usuarios";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // 4. EFECTO INICIAL
  useEffect(() => {
    fetchData();
  }, []);

  // 5. MANEJADORES (Handlers)
  const handleBack = () => {
    navigate("/dashboard");
  };

  // Abrir modal para CREAR (limpiamos el usuario a editar)
  const handleNewUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR (pasamos el usuario seleccionado)
  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  /* Función para ver detalles del usuario a futuro
  const handleViewDetails = (userId) => {
    console.log("Ver detalles de:", userId);
  }; */

  // Cerrar el modal sin hacer nada más
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  // Se ejecuta cuando el formulario guardó exitosamente
  const handleFormSuccess = () => {
    handleCloseModal(); // 1. Cerramos el modal
    fetchData(); // 2. Recargamos la tabla para ver el cambio nuevo
  };

  // Mensajes de carga y error
  if (loading && !isModalOpen)
    return <div className="loading-msg">Cargando usuarios...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;

  // El achetemele
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
                  <td>{user.phone || "-"}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`role-badge role-${user.role?.toLowerCase()}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="actions-cell">
                    {/* Pasamos el objeto 'user' completo a handleEdit */}
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

      {/* MODAL: Renderizado condicional */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <UserForm
              userToEdit={editingUser} // Prop: Datos (null si es nuevo)
              onClose={handleCloseModal} // Prop: Función para cancelar
              onSuccess={handleFormSuccess} // Prop: Función tras guardar
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList;
