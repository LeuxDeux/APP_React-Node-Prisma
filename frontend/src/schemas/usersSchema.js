import { z } from "zod";

export const userSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"), //El nombre de usuario debe tener al menos un caracter
  email: z.email("El email no es válido"), //El email se valida solo, sin regex ni cosas raras
  address: z.string().min(1, "La dirección es requerida"),
  phonenumber: z.string().min(1, "El teléfono es requerido"),
  role: z.enum(["admin", "user"], {
    errorMap: () => ({ message: "Seleccione un rol válido" }),
  }), //El rol debe ser 'admin' o 'user', sino da error
  password: z.string().optional(), //La contraseña se marca opcional por si es edición. Si es creación es obligatoria
});