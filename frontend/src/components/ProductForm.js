import { useState, useEffect } from 'react';
import { productsAPI } from '../services/productServices';

function ProductForm({ product, onSuccess, onCancel }) { // Componente para el formulario de creación/edición de productos. Recibe 3 props: product (objeto del producto a editar o null para nuevo), onSuccess (función a llamar tras guardar con éxito), onCancel (función a llamar para cancelar).
  const [formData, setFormData] = useState({ // Estado local para los datos del formulario. Valor inicial con campos vacíos.
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [error, setError] = useState(null); // Estado para almacenar mensajes de error.
  const [loading, setLoading] = useState(false); // Estado para indicar si se está procesando el envío del formulario.

  // Cargar datos si es edición
  useEffect(() => {
    if (product) { // Si product existe es una edición, cargar los datos del producto en el formulario.
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
      });
    }
  }, [product]); // Dependencia para ejecutar el efecto cuando cambie product.

  const handleChange = (e) => {
    const { name, value } = e.target; // Obtener nombre y valor del campo modificado.
    setFormData({  // Actualizar el estado formData con el nuevo valor.
      ...formData,  // Mantener los demás campos sin cambios o copia todos los datos existentes del formulario
      [name]: value,  // Actualizar solo el campo que cambió
    });
  };

  const handleSubmit = async (e) => { // Manejador del envío del formulario.
    e.preventDefault();  // Prevenir el comportamiento por defecto del formulario. En este caso recargar la página.
    setError(null); // Limpiar errores previos  

    // Validación de que todos los campos estén llenos. Si alguno está vacio muestra error y no continúa.
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.stock) {
      setError('Todos los campos son requeridos');
      return;
    }

    try {
      setLoading(true); // Activa loading para deshabilitar botón mientras se procesa.
      if (product) { // Si existe product llama UPDATe
        // Editar
        await productsAPI.updateProduct(product.id, formData);
      } else {  // Si no existe el producto llama CREATE
        // Crear
        await productsAPI.createProduct(formData);
      }
      onSuccess(); // Llama a la función onSuccess pasada como prop para notificar que se guardó con éxito.
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.error || 'Error al guardar producto');
    } finally { // Finally siempre desactiva el loading
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', marginBottom: '20px' }}>
      <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2> {/* Título dinámico según si es edición o creación. Si product existe muestra editar, sino nuevo */}
      
      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <form onSubmit={handleSubmit}> {/* Manejador del envío del formulario */}
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name} // Valor del campo nombre del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Descripción:</label>
          <textarea
            name="description"
            value={formData.description} // Valor del campo descripción del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: '100%', padding: '8px', minHeight: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Precio:</label>
          <input
            type="number"
            name="price"
            value={formData.price} // Valor del campo precio del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            step="0.01"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Categoría:</label>
          <input
            type="text"
            name="category"
            value={formData.category} // Valor del campo categoría del estado
            onChange={handleChange} // Manejador del cambio para actualizar el estado, lo ejecuta al escribir
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label>Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProductForm;
