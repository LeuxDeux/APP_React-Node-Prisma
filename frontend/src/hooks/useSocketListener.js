import { useEffect } from "react";
import { io } from "socket.io-client";

export const useSocketListener = (eventName, handler) => {
  useEffect(() => {
    // 1. Usamos la variable de entorno o fallback a localhost
    const backendUrl = "http://localhost:5000";

    // 2. Conexión
    const socket = io(backendUrl);

    // 3. Suscripción al evento específico
    //Recibe el nombre del evento por parámetro, y la función payload 
    //que se ejecuta al recibir el evento
    socket.on(eventName, (payload) => {
      // Opcional: Log para depuración
      console.log(`Evento recibido: ${eventName}`);

      // Ejecutamos la función que nos pasaron (el refetch)
      if (handler) handler(payload);
    });

    // 4. Limpieza: Desconectar al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [eventName, handler]); // Se recrea si cambia el evento o la función
};
