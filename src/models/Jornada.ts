/**
 * src/models/Jornada.ts
 * Definición del Modelo de Datos.
 * * En TypeScript, las 'interfaces' definen la forma que deben tener los objetos.
 * Es equivalente a un 'struct' en C o una clase POJO en Java, pero
 * desaparece al compilarse (es solo para control de errores en tiempo de desarrollo).
 */

// 1. Definimos la LISTA MAESTRA (Array de Strings)
// "as const" es el truco mágico. Le dice a TS: 
// "Este array es de SOLO LECTURA y sus valores son LITERALES, no strings genéricos".
export const TIPOS_JORNADA = ['Normal', 'Franco', 'Vacaciones', 'Extra'] as const;

// 2. Derivamos el TIPO automáticamente desde el array
// Significa: "El tipo TipoJornada es cualquiera de los valores que estén dentro de TIPOS_JORNADA"
export type TipoJornada = typeof TIPOS_JORNADA[number];

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