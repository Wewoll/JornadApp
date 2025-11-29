// src/constants/Colors.ts

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export const Colores = {
  light: {
    text: '#000',
    // Agregamos un texto secundario (para etiquetas como "Normales:", "50%:")
    textSecondary: '#777', 
    background: '#f0f0f0',
    cardBackground: '#fff',
    separator: '#eee',

    // NUEVOS VALORES
    shadow: '#000',           // Color de la sombra
    textOnPrimary: '#fff',    // Color para texto/iconos sobre botones azules
    
    // Colores específicos para la sección de "Notas/Observaciones"
    noteBackground: '#f9f9f9',
    noteText: '#666',

    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    estados: {
      normal: '#607D8B',
      franco: '#FFD700',
      vacaciones: '#2196F3',
      extra: '#FF5722',
      textoFranco: '#dfb50cff',
    }
  },
  dark: {
    text: '#fff',
    // En modo oscuro, el texto secundario es un gris clarito
    textSecondary: '#aaa', 
    background: '#121212',
    cardBackground: '#2C2C2C', // Tu gris elegido
    separator: '#444',

    // NUEVOS VALORES
    shadow: '#000',           // En dark mode la sombra sigue siendo negra
    textOnPrimary: '#fff',    // El icono sigue siendo blanco sobre el botón azul

    // Para la nota en dark mode:
    // Si la tarjeta es #2C2C2C, la nota debe ser un poco más clara o más oscura para notarse.
    // Probemos con #383838 (un pelín más claro que la tarjeta)
    noteBackground: '#383838', 
    noteText: '#ccc', // Texto de nota bien legible

    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    estados: {
      normal: '#90A4AE',
      franco: '#FFD700',
      vacaciones: '#64B5F6',
      extra: '#FF8A65',
      textoFranco: '#FFD700',
    }
  },
};