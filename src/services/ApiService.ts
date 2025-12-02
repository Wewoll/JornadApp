/**
 * src/services/ApiService.ts
 * Capa de Abstracción de Red (Network Service).
 * * Responsabilidad:
 * Centralizar la comunicación HTTP con el backend (Google Apps Script).
 * Este módulo actúa como una interfaz entre la lógica de la aplicación (Frontend)
 * y la persistencia de datos (Backend), manejando la serialización, 
 * configuración de cabeceras y manejo de errores de conexión.
 */

import { Jornada } from '../models/Jornada';

// Endpoint público del Web App de Google Apps Script.
// Esta URL apunta a la implementación "exec" que ejecuta el código del backend.
const API_URL = 'https://script.google.com/macros/s/AKfycbwPt6pqkhdHK5vW4ciTFh70CHD58TLOEna5kV8AtGRYlkPAbJO4kVRf6EQQjfGgZa9m/exec';

export const ApiService = {
  
  /**
   * Realiza una petición GET al servidor para obtener la lista completa de registros.
   * * @returns {Promise<Jornada[]>} 
   * Promesa que resuelve a un array de objetos Jornada.
   * Si ocurre un error de red o lógico, captura la excepción y retorna un array vacío
   * para mantener la estabilidad de la interfaz de usuario.
   */
  fetchJornadas: async (): Promise<Jornada[]> => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      
      // Verificación del contrato de respuesta del backend ({ status, data })
      if (json.status === 'success') {
        return json.data;
      } else {
        console.error("ApiService: Error lógico reportado por el backend:", json.message);
        return [];
      }
    } catch (error) {
      console.error("ApiService: Fallo crítico de red en fetchJornadas:", error);
      return [];
    }
  },

  /**
   * Envía una petición POST para modificar el estado de los datos (Crear, Actualizar, Borrar).
   * Utiliza el patrón de "Method Tunneling" enviando la acción deseada dentro del cuerpo JSON,
   * ya que Apps Script tiene soporte limitado para verbos HTTP como PUT o DELETE.
   * * @param accion - Tipo de operación a realizar ('create' | 'update' | 'delete').
   * @param jornada - El objeto de datos (DTO) sobre el cual operar.
   * @returns {Promise<boolean>} 
   * True si la operación fue confirmada exitosamente por el servidor.
   * False si hubo errores de red o excepciones en el backend.
   */
  sendAction: async (accion: 'create' | 'update' | 'delete', jornada: Jornada): Promise<boolean> => {
    try {
      // Configuración específica para evitar preflight requests (OPTIONS) complejos de CORS.
      // Se utiliza 'text/plain' aunque se envíe JSON para simplificar la aceptación en GAS.
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify({
          accion: accion,
          payload: jornada
        })
      });

      const json = await response.json();
      
      if (json.status === 'success') {
        return true;
      } else {
        console.error("ApiService: El servidor rechazó la operación:", json.message);
        return false;
      }

    } catch (error) {
      console.error(`ApiService: Fallo crítico de red en ${accion}:`, error);
      return false;
    }
  }
};