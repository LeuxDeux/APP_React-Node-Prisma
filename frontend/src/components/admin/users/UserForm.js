import { useMemo } from "react"; // Importamos useMemo
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../../schemas/usersSchema";
import { usersAPI } from "../../../services/usersServices";
import InputForm from "../common/InputForm";
import SelectForm from "../common/SelectForm";
import "../common/styles/FormStyles.css";

// 1. CONSTANTES 
// Lo ponemos acá para no andar repitiendo la declaración de campos vacíos
const DEFAULT_VALUES = {
  username: "",
  email: "",
  password: "", // Siempre inicia vacío
  address: "",
  phonenumber: "",
  role: "",
};

const ROLES = [ // Opciones para el select de roles. #TODO: Dinamizar si hay más roles
  { value: "admin", label: "ADMIN" },
  { value: "user", label: "USER" },
];

function UserForm({ userToEdit, onSuccess, onClose }) {
  
  // 2. MEMOIZACIÓN DE VALORES
  // Calculamos los valores iniciales. Si userToEdit cambia, esto se recalcula.
  // Esto reemplaza completamente a tu useEffect.
  // El useMemo es un Hook de React que memoriza un valor calculado, en este caso el objeto de valores iniciales.
  const initialValues = useMemo(() => {
    if (userToEdit) {
      return {
        username: userToEdit.username,
        email: userToEdit.email,
        address: userToEdit.address,
        phonenumber: userToEdit.phonenumber,
        role: userToEdit.role,
        password: "", // Al editar, reseteamos password a vacío
      };
    }
    return DEFAULT_VALUES;
  }, [userToEdit]);

  // 3. CONFIGURACIÓN DEL REACT HOOK FORM
  // -control: objeto de control del formulario. Es para el objeto Controller.
  // -handleSubmit: función para manejar el submit
  // -setError: función para setear errores manualmente
  // -errors: objeto con errores de validación
  // -isSubmitting: booleano que indica si el formulario se está enviando
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema), // El resolver de Zod para validación, usa el Schema definido
    defaultValues: DEFAULT_VALUES, // Valores por defecto para el primer render
    values: initialValues,         // <--- LA CLAVE: Reactiva el formulario ante cambios
    resetOptions: {
      keepDirtyValues: true,       // Opcional: Si el usuario estaba escribiendo y cambia algo externo, intenta mantener lo escrito
    },
  });

  // 4. SUBMIT
  const onSubmit = async (data) => {
    try {
      // Validación de borde: Password obligatorio solo al crear
      if (!userToEdit && !data.password) {
        setError("password", { message: "La contraseña es obligatoria al crear" });
        return;
      }

      // Sanitización del payload
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
      // Asumiendo que su backend devuelve { error: "Mensaje" }
      alert(err.response?.data?.error || "Error al procesar la solicitud");
    }
  };

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

        {/* Renderizado Condicional Limpio */}
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