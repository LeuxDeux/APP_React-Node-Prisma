import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import ProductForm from "./ProductForm";
import { useFetch } from "../../../hooks/useFetch"; // Su hook personalizado
import { productsAPI } from "../../../services/productServices";
import "../common/styles/ListStyles.css";

function ProductList() {
  // 1. Data Fetching
  const { data, loading, error, refetch } = useFetch("/products");

  // API devuelve { success: true, products: [...] }
  const products = data?.products || [];

  // 2. UI States
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  // 3. Handlers
  const handleNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
    refetch();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      try {
        await productsAPI.deleteProductByID(id);
        refetch();
      } catch (err) {
        console.error("Error deleting:", err);
        alert("Error al eliminar producto");
      }
    }
  };

  // EFECTO DE WEBSOCKET
  useEffect(() => {
    // 1. Conectamos al servidor
    const socket = io("http://localhost:5000"); // URL de su Backend

    // 2. Escuchamos el evento
    socket.on("server:products_updated", () => {
      console.log("¡Cambio detectado! Recargando lista...");
      refetch(); // <-- La magia: vuelve a pedir los datos a la API
    });

    // 3. Limpieza (Cleanup): Desconectamos al salir de la pantalla
    return () => {
      socket.disconnect();
    };
  }, [refetch]); // Dependencia: refetch

  // 4. Render
  if (loading && !showForm)
    return <div className="loading-msg">Cargando productos...</div>;
  if (error) return <div className="error-msg">Error: {error}</div>;

  return (
    <div className="list-container">
      {/* Encabezado */}
      <div className="list-header">
        <button
          className="btn btn-back"
          onClick={() => navigate("/dashboard")}
          title="Volver al Dashboard"
        >
          ← Atrás
        </button>
        <h1 className="list-title">Gestión de Productos</h1>
        <button className="btn btn-new" onClick={handleNewProduct}>
          + Nuevo Producto
        </button>
      </div>

      {/* Tabla */}
      <div className="table-wrapper">
        {products.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio</th>
                <th>Categoría</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>${product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td className="actions-cell">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditProduct(product)}
                      title="Editar producto"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                      title="Eliminar producto"
                    >
                      🗑️ Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-items">No hay productos registrados</p>
        )}
      </div>

      {/* MODAL */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;
