import { useState, useEffect, useCallback } from "react";
import api from "../services/api"; // Su instancia de axios

/* Custom Hook: useFetch
  Parámetros:
  - endpoint: string - La URL del endpoint a llamar (relativa a la base URL de axios)
  Retorna:
  - data: any - Los datos obtenidos de la API
  - loading: boolean - Indica si la petición está en curso
  - error: string | null - Mensaje de error si la petición falla
  - refetch: function - Función para volver a ejecutar la petición

  De esta manera podemos reutilizar la lógica de fetch en cualquier componente para cargar datos desde la API.

*/

export const useFetch = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  /* Función para obtener datos de la API
  Podemos ver que sigue el curso natural de un fetch:
  - Inicia la carga (setLoading(true))
  - Resetea errores previos (setError(null))
  - Hace la petición (api.get(endpoint))
  - Si es exitosa, guarda los datos (setData)
  - Si falla, guarda el error (setError)
  - Finalmente, marca que ya no está cargando (setLoading(false))
  Esta función está envuelta en useCallback para evitar recrearla en cada render
  y solo cambiarla si el endpoint cambia.
  */
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
