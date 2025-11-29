// src/models/Jornada.ts

// Definimos los tipos de días posibles (esto ayuda a los colores después)
export type TipoJornada = 'Normal' | 'Franco' | 'Vacaciones' | 'Extra';

export interface Jornada {
  id: string;           // Un identificador único (usaremos la fecha ej: "2025-01-28")
  fecha: string;        // La fecha legible
  horasNormales: number;
  horas50: number;
  horas100: number;
  tipo: TipoJornada;    // Aquí usamos el tipo que definimos arriba
  observaciones?: string; // El "?" significa que es opcional (puede ser null)
}