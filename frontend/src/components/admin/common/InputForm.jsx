import { Controller } from "react-hook-form";

/*
    Componente InputForm
    Componente atómico para un input controlado con react-hook-form
    Props:
    - name: nombre del campo en el formulario
    - control: objeto control de react-hook-form
    - label: etiqueta para el input
    - type: tipo de input (text, email, password, etc.), por defecto "text"
    - error: objeto de error para mostrar mensajes de validación
    Es el objeto genérico que se usa después en el formulario (es un campo)
*/
const InputForm = ({ name, control, label, type = "text", error }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            id={name}
            type={type}
            {...field}
            // Importante: value nunca debe ser undefined para inputs controlados
            value={field.value || ""} 
            className={`form-control ${error ? "is-invalid" : ""}`}
          />
        )}
      />
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );
};

export default InputForm;