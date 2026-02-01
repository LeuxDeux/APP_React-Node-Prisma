import { useState, useEffect } from 'react';
import { productsAPI } from '../../../services/productServices';
import ProductForm from './ProductForm';
import { useNavigate } from 'react-router-dom';

//Import de hooks, useState para productos, carga, error mostrar formulario y editar producto.
//Componente principal ProductList que maneja la lista de productos.
function ProductList() {
  const [products, setProducts] = useState([]);  //Array que almacena la lista de productos. Valor inicial [] porque es una lista vacía al inicio
  const [loading, setLoading] = useState(true); //Boolean para indicar si se está cargando. Valor inicial true porque al montar el componente se inicia la carga.
  const [error, setError] = useState(null); //Almacena mensajes de error. Valor inicial null porque no hay error al inicio.
  const [showForm, setShowForm] = useState(false); //Booleano para mostrar/ocultar el formulario. Valor inicial false porque el formulario no se muestra al inicio.
  const [editingProduct, setEditingProduct] = useState(null); //Almacena el producto que se está editando. Valor inicial null porque no se está editando ningún producto al inicio.
//Import de useEffect para cargar productos al montar el componente.
  // Obtener productos
  // useEffect se ejecuta cuando el componente se monta "AL TENER [] SE MONTA UNA SOLA VEZ".
  useEffect(() => {
    fetchProducts();
  }, []);
  //Función asíncrona para obtener productos desde el backend.
  //1. Activa el loading seteandolo en true.
  //2. Llama al servicio productsAPI.getAllProducts() para obtener los productos.
  //3. Si la petición es exitosa, actualiza el estado products con los datos recibidos y resetea el error a null.
  //4. Si hay un error, lo captura y actualiza el estado error con un mensaje.
  //5. Finalmente, desactiva el loading seteandolo en false.
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAllProducts();
      setProducts(response.data.products);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();
  const handleBack = () => {
    navigate("/dashboard");
  };
  //Manejador del botón "Nuevo Producto".
  const handleNewProduct = () => {
    setEditingProduct(null); //-> Resetea el producto en edición a null.
    setShowForm(true); //-> Muestra el formulario para crear un nuevo producto.
  };
  //Manejador para editar un producto.
  const handleEditProduct = (product) => {
    setEditingProduct(product); //-> Establece el producto seleccionado para edición.
    setShowForm(true); //-> Muestra el formulario para editar el producto.
  };
  //Manejador para cerrar el formulario.
  const handleCloseForm = () => {
    setShowForm(false); //-> Oculta el formulario.
    setEditingProduct(null); //-> Resetea el producto en edición a null.
  };
  //Manejador que se llama cuando el formulario se envía con éxito.
  const handleFormSuccess = () => {
    fetchProducts(); //-> Recarga la lista de productos después de un envío exitoso.
    handleCloseForm(); //-> Cierra el formulario.
  };
   //Manejador para eliminar un producto.
  const handleDeleteProduct = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productsAPI.deleteProductByID(id);
        fetchProducts();  //-> Recarga la lista de productos después de eliminar uno.
      } catch (err) {
        console.error('Error deleting product:', err);
        setError('Error al eliminar producto');
      }
    }
  };

  if (loading && products.length === 0) return <div>Cargando productos...</div>; //Muestra un mensaje de carga si está cargando y no hay productos aún.
  if (error) return <div style={{ color: 'red' }}>{error}</div>; //Muestra un mensaje de error si hay un error.

  return (
    <div>
      <button
        className="btn btn-back"
        onClick={handleBack}
        title="Volver al Dashboard"
      >
        ← Atrás
      </button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1>Productos</h1>
        <button onClick={handleNewProduct}>+ Nuevo Producto</button>{" "}
        {/* Botón para crear un nuevo producto */}
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {showForm && (
        <ProductForm
          product={editingProduct} // Si editingProduct es null, el formulario es para crear un nuevo producto; si tiene un valor, es para editar.
          onSuccess={handleFormSuccess} // Llama a esta función cuando el formulario se envía con éxito.
          onCancel={handleCloseForm} // Llama a esta función para cerrar el formulario sin guardar cambios.
        />
      )}

      {!showForm && ( // Muestra la lista de productos solo si el formulario no está visible
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(
              (
                product, // Itera sobre la lista de productos y muestra cada uno en una fila de la tabla
              ) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button onClick={() => handleEditProduct(product)}>
                      {" "}
                      {/* Botón para editar el producto */}
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      style={{ marginLeft: "5px" }}
                    >
                      {" "}
                      {/* Botón para eliminar el producto */}
                      Eliminar
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ProductList;
