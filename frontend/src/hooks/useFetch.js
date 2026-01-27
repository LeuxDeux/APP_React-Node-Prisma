import { useState, useEffect } from "react";

export const useFetch = (url)  => {
	const [data, setData] = useState(null) // Estado para almacenar los datos
	const [loading, setLoading] = useState(true) // Estado de carga
	const [error, setError] = useState(null) // Estado para almacenar errores
	
	useEffect(() => {
		let controller = new AbortController(); // Para cancelar la petición si el componente se desmonta
		
		setLoading(true) // Iniciamos la carga cuando se monta el componente
		
		const fetchData = async () => { // Función asíncrona para obtener los datos
			try {
				const response = await fetch(url, controller); // Realizamos la petición
				
				if(!response.ok) {
					throw new Error("Error en la petición") // Si la respuesta no es ok, lanzamos un error
				}
				
				const jsonData = await response.json(); // Parseamos la respuesta a JSON
				
				setData(jsonData) // Actualizamos el estado con los datos obtenidos
				setError(null) // Reseteamos el estado de error
			} catch (err){
				setError(err) // Actualizamos el estado con el error
			} finally {
				setLoading(false) // Finalizamos la carga haya sido error o no
			}
		}
		fetchData(); // Llamamos a la función para obtener los datos
		
		return () => {
		controller.abort() // Cancelamos la petición si el componente se desmonta
		}
		
	}, [url])
	return { data, loading, error } // Devolvemos los estados
}