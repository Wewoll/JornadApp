/**
 * src/models/Jornada.ts
 * Definición del Modelo de Datos.
 * * En TypeScript, las 'interfaces' definen la forma que deben tener los objetos.
 * Es equivalente a un 'struct' en C o una clase POJO en Java, pero
 * desaparece al compilarse (es solo para control de errores en tiempo de desarrollo).
 */

// Definimos un "Union Type".
// Es similar a un ENUM en Java/C, pero más flexible.
// La variable 'tipo' SOLO podrá contener una de estas cuatro cadenas exactas.
export type TipoJornada = 'Normal' | 'Franco' | 'Vacaciones' | 'Extra';

export interface Jornada {
  // Identificador único (Primary Key). 
  // En este proyecto usaremos un timestamp o la fecha, pero siempre como string.
  id: string;           

  // Fecha legible para humanos (ej: "01/01/2025").
  fecha: string;        

  // Cantidad de horas trabajadas en cada categoría.
  horasNormales: number;
  horas50: number;
  horas100: number;

  // El tipo de día, restringido a los valores definidos arriba.
  tipo: TipoJornada;    

  // El signo de interrogación (?) indica que esta propiedad es OPCIONAL.
  // Puede ser un string o 'undefined'.
  observaciones?: string; 
}