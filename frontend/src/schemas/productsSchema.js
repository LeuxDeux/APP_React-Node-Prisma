import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  category: z.string().min(1, "La categoría es obligatoria"),

  // COERCIÓN: Transformamos el texto del input a número automáticamente
  price: z.coerce
    .number({ invalid_type_error: "Debe ser un número válido" })
    .min(0.01, "El precio debe ser mayor a 0"),

  stock: z.coerce
    .number({ invalid_type_error: "Debe ser un número válido" })
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),
});
