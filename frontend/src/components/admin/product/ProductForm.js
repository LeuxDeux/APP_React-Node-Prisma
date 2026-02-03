import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "../../../schemas/productsSchema"; // Ajustar ruta
import { productsAPI } from "../../../services/productServices"; // Ajustar ruta
import InputForm from "../common/InputForm";
import TextAreaForm from "../common/TextAreaForm"; // El nuevo componente
import "../common/styles/FormStyles.css"; // Reutilizamos el CSS de usuarios 

const DEFAULT_VALUES = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
};

function ProductForm({ product, onSuccess, onCancel }) {
  // 1. Memoizamos valores iniciales
  const initialValues = useMemo(() => {
    if (product) {
      return {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      };
    }
    return DEFAULT_VALUES;
  }, [product]);

  // 2. Configuración RHF
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: DEFAULT_VALUES,
    values: initialValues,
  });

  // 3. Submit
  const onSubmit = async (data) => {
    try {
      // Zod ya convirtió price y stock a números.
      // El backend de Lactato espera name, description, price, category, stock.

      if (product) {
        await productsAPI.updateProduct(product.id, data);
      } else {
        await productsAPI.createProduct(data);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Error al guardar producto");
    }
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>{product ? "Editar Producto" : "Nuevo Producto"}</h2>
        <button type="button" className="btn-close-x" onClick={onCancel}>
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="user-form">
        <InputForm
          name="name"
          label="Nombre del Producto"
          control={control}
          error={errors.name}
        />

        <TextAreaForm
          name="description"
          label="Descripción"
          control={control}
          error={errors.description}
        />

        <div className="form-row">
          <div className="half-width">
            <InputForm
              name="category"
              label="Categoría"
              control={control}
              error={errors.category}
            />
          </div>
          <div className="half-width">
            <InputForm
              name="price"
              label="Precio ($)"
              type="number"
              control={control}
              error={errors.price}
            />
          </div>
        </div>

        <InputForm
          name="stock"
          label="Stock Disponible"
          type="number"
          control={control}
          error={errors.stock}
        />

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>
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

export default ProductForm;
