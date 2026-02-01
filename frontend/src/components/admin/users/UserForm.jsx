import { useState, useEffect } from "react";
import { usersAPI } from "../../../services/usersServices";

function UserForm({ userToEdit, onSuccess, onClose }) {
  // Componente para el formulario de creación/edición de usuarios. Recibe 3 props: userToEdit (objeto del usuario a editar o null para nuevo), onSuccess (función a llamar tras guardar con éxito), onClose (función a llamar para cancelar).
  const [formData, setFormData] = useState({
    // Estado local para los datos del formulario. Valor inicial con campos vacíos.
    username: "",
    password: "",
    address: "",
    phonenumber: "",
    email: "",
    role: "",
  });
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error.
  const [loading, setLoading] = useState(false); // Estado para indicar si se está procesando el envío del formulario.

  const roles = [
    { value: "admin", label: "ADMIN" },
    { value: "user", label: "USER" },
  ]; // Opciones de roles disponibles

  
  // Cargar datos si es edición
  useEffect(() => {
    if (userToEdit) {
      // Si userToEdit existe es una edición, cargar los datos del usuario en el formulario.
      setFormData({
        username: userToEdit.username,
        address: userToEdit.address,
        phonenumber: userToEdit.phonenumber,
        email: userToEdit.email,
        role: userToEdit.role,
      });
    } else {
      // Si no es edición (nuevo usuario), limpiar el formulario.
      setFormData({
        username: "",
        password: "",
        address: "",
        phonenumber: "",
        email: "",
        role: "",
      });
    }
  }, [userToEdit]); // Dependencia para ejecutar el efecto cuando cambie userToEdit.

  const handleChange = (e) => {
    const { name, value } = e.target; // Obtener nombre y valor del campo modificado.
    setFormData({
      // Actualizar el estado formData con el nuevo valor.
      ...formData, // Mantener los demás campos sin cambios o copia todos los datos existentes del formulario
      [name]: value, // Actualizar solo el campo que cambió
    });
  };

  const handleSubmit = async (e) => {
    // Manejador del envío del formulario.
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario. En este caso recargar la página.
    setError(null); // Limpiar errores previos

    // Validación de que todos los campos estén llenos. Si alguno está vacio muestra error y no continúa.
    if (
      !formData.username ||
      (!userToEdit && !formData.password) ||
      !formData.address ||
      !formData.phonenumber ||
      !formData.email ||
      !formData.role
    ) {
      setError("Todos los campos son requeridos");
      return;
    }

    try {
      setLoading(true); // Activa loading para deshabilitar botón mientras se procesa.
      if (userToEdit) {
        // Si existe userToEdit llama UPDATE
        // Editar
        await usersAPI.updateUser(userToEdit.id, formData);
      } else {
        // Si no existe el usuario llama CREATE
        // Crear
        await usersAPI.createUser(formData);
      }
      onSuccess(); // Llama a la función onSuccess pasada como prop para notificar que se guardó con éxito.
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.error || "Error al guardar usuario");
    } finally {
      // Finally siempre desactiva el loading
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <h2>{userToEdit ? "Editar Usuario" : "Nuevo Usuario"}</h2>{" "}
      {/* Título dinámico según si es edición o creación. Si userToEdit existe muestra editar, sino nuevo */}
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        {" "}
        {/* Manejador del envío del formulario */}
        <div style={{ marginBottom: "10px" }}>
          <label>Nombre Usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username} // Valor del campo nombre del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        {userToEdit ? null : ( // Mostrar campo contraseña solo si es creación
          <div style={{ marginBottom: "10px" }}>
            <label>Contraseña:</label>
            <input
              name="password"
              type="password"
              value={formData.password} // Valor del campo contraseña del estado
              onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}
        <div style={{ marginBottom: "10px" }}>
          <label>Dirección:</label>
          <input
            type="text"
            name="address"
            value={formData.address} // Valor del campo dirección del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Teléfono:</label>
          <input
            type="text"
            name="phonenumber"
            value={formData.phonenumber} // Valor del campo teléfono del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={formData.email} // Valor del campo email del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "10px" }}>
          <label>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((rol) => (
              <option key={rol.value} value={rol.value}>
                {rol.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </button>
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
