import { Controller } from "react-hook-form";

const TextAreaForm = ({ name, control, label, rows = 3, error }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <textarea
            id={name}
            {...field}
            rows={rows}
            value={field.value || ""}
            className={`form-control ${error ? "is-invalid" : ""}`}
            style={{ resize: "vertical" }} 
          />
        )}
      />
      {error && <p className="error-text">{error.message}</p>}
    </div>
  );
};

export default TextAreaForm;