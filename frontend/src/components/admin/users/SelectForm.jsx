import React from "react";
import { Controller } from "react-hook-form";

/*
    Componente SelectForm
    Similar al InputForm pero para selects
    Props:
    - name: nombre del campo en el formulario
    - control: objeto control de react-hook-form
    - label: etiqueta para el select
    - options: array de opciones { value, label } para el select
    - error: objeto de error para mostrar mensajes de validación
    Es el objeto genérico que se usa después en el formulario (es un campo)
*/

const SelectForm = ({ name, control, label, options, error }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <select
            id={name}
            {...field}
            value={field.value || ""}
            className={`form-control ${error ? "is-invalid" : ""}`}
          >
            <option value="">-- Seleccionar --</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}
      />
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );
};

export default SelectForm;