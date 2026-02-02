import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../schemas/usersSchema";
import { usersAPI } from "../../../services/usersServices";
// Importamos nuestros componentes atómicos
import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import "./UserForm.css";

function UserForm({ userToEdit, onSuccess, onClose }) {
  /* 1. CONFIGURACIÓN
  Como usamos react-hook-form con zod, configuramos el hook aquí
  para manejar el formulario completo
  Notar que desestructuramos lo que nos llega desde zodResolver(usersSchema)

  */
  const {
    control, // Necesario para el componente Controller
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      address: "",
      phonenumber: "",
      role: "",
    },
  });

  const ROLES = [
    { value: "admin", label: "ADMIN" },
    { value: "user", label: "USER" },
  ];

  /* 2. EFECTO DE CARGA (Edición)
  Cargamos los datos del usuario a editar en el formulario
  Usamos reset() para establecer los valores del formulario
  Si no hay userToEdit, reseteamos a valores vacíos
  */
  useEffect(() => {
    if (userToEdit) {
      reset({
        username: userToEdit.username,
        email: userToEdit.email,
        address: userToEdit.address,
        phonenumber: userToEdit.phonenumber,
        role: userToEdit.role,
        password: "", // Password vacío al editar
      });
    } else {
      reset({
        username: "",
        email: "",
        address: "",
        phonenumber: "",
        role: "",
        password: "",
      });
    }
  }, [userToEdit, reset]);

  /* 3. SUBMIT
  Manejador del submit del formulario
  Diferenciamos entre creación y edición según userToEdit
  Hacemos la llamada a la API correspondiente
  Llamamos a onSuccess() si todo va bien
  */
  const onSubmit = async (data) => {
    try {
      // Validación manual de password requerido solo al crear
      if (!userToEdit && !data.password) {
        setError("password", { type: "manual", message: "La contraseña es obligatoria al crear" });
        return;
      }

      // Sanitización
      const payload = { ...data };
      if (!payload.password) delete payload.password;

      if (userToEdit) {
        await usersAPI.updateUser(userToEdit.id, payload);
      } else {
        await usersAPI.createUser(payload);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error al guardar");
    }
  };

  /* 4. RENDERIZADO 
  Zod se encarga de manejar los errores y de lo que se muestra
  No hace las comprobaciones hasta el submit, así que no hay validación en tiempo real
  Es más rápido y simple para formularios administrativos
  */
  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>{userToEdit ? "Editar Usuario" : "Nuevo Usuario"}</h2>
        <button type="button" className="btn-close-x" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        
        <InputForm
          name="username"
          label="Nombre Usuario"
          control={control}
          error={errors.username}
        />

        {/* El campo de password SOLO aparece al CREAR usuario, no al editar */}
        {!userToEdit && (
          <InputForm
            name="password"
            label="Contraseña *"
            type="password"
            control={control}
            error={errors.password}
          />
        )}

        <InputForm
          name="address"
          label="Dirección"
          control={control}
          error={errors.address}
        />

        <div className="form-row">
          <div className="half-width">
            <InputForm
              name="phonenumber"
              label="Teléfono"
              control={control}
              error={errors.phonenumber}
            />
          </div>
          <div className="half-width">
            <InputForm
              name="email"
              label="Email"
              type="email"
              control={control}
              error={errors.email}
            />
          </div>
        </div>

        <SelectForm 
            name="role"
            label="Rol"
            control={control}
            options={ROLES}
            error={errors.role}
        />

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;