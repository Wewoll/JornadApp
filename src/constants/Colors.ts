/**
 * src/constants/Colors.ts
 * Sistema de Diseño Centralizado.
 * * Este archivo actúa como una "Hoja de Estilos Global".
 * En lugar de usar colores hexadecimales (#FFF, #000) dispersos por toda la app,
 * usamos variables con nombres semánticos (ej: 'background', 'separator').
 * * Esto nos permite:
 * 1. Cambiar el tema de toda la app tocando un solo archivo.
 * 2. Manejar Modo Claro y Oscuro fácilmente.
 */

// Colores base (Primitivos)
const tintColorLight = '#2f95dc'; // Azul principal
const tintColorDark = '#fff';     // Blanco para resaltar en modo oscuro

export const Colores = {
  // ============================================================
  // PALETA MODO CLARO (Light Mode)
  // ============================================================
  light: {
    // Textos
    text: '#000',             // Texto principal (Negro puro)
    textSecondary: '#777',    // Texto secundario (etiquetas, subtítulos)
    textUnselected: '#000',   // Texto en botones desactivados
    textOnPrimary: '#fff',    // Texto sobre botones de color intenso

    // Fondos
    background: '#f0f0f0',    // Fondo general de la pantalla (Gris muy suave)
    cardBackground: '#fff',   // Fondo de las tarjetas/modales (Blanco)
    inputBackground: '#f5f5f5', // Fondo de los campos de texto
    noteBackground: '#f9f9f9',  // Fondo para notas/observaciones
    noteText: '#666',           // Texto en notas/observaciones

    // Elementos de UI
    separator: '#eee',        // Líneas divisorias sutiles
    shadow: '#000',           // Color de la sombra (Elevation)
    danger: '#d32f2f',        // Color semántico para acciones negativas
    tint: tintColorLight,     // Color de acento principal (Botones activos, links)
    buttonUnselected: '#e0e0e0', // Fondo de botones inactivos
    
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,

    // Colores de Estado (Lógica de Negocio)
    estados: {
      Normal: '#607D8B',      // Gris Azulado
      Franco: '#B7950B',      // Dorado
      Vacaciones: '#2196F3',  // Azul Material
      Extra: '#FF5722',       // Naranja Intenso
    }
  },

  // ============================================================
  // PALETA MODO OSCURO (Dark Mode)
  // ============================================================
  dark: {
    // Textos
    text: '#fff',             // Texto principal (Blanco)
    textSecondary: '#aaa',    // Texto secundario (Gris medio)
    textUnselected: '#fff',   // Texto en botones desactivados
    textOnPrimary: '#fff',    

    // Fondos
    background: '#121212',    // Fondo general (Casi negro, mejor para pantallas OLED)
    cardBackground: '#2C2C2C',// Fondo de tarjetas (Gris oscuro, NO negro puro para tener profundidad)
    inputBackground: '#383838', // Un poco más claro que la tarjeta para que el input resalte
    noteBackground: '#383838', // Fondo para notas/observaciones
    noteText: '#ccc',         // Texto en notas/observaciones

    // Elementos de UI
    separator: '#444',        // Líneas divisorias más oscuras
    shadow: '#000',           // Sombra (se nota poco en dark mode, pero está)
    danger: '#ef5350',        // Color semántico para acciones negativas
    tint: tintColorDark,      // En modo oscuro, el acento suele ser blanco o el mismo azul
    buttonUnselected: '#444', // Botones inactivos oscuros

    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,

    // Colores de Estado (Adaptados para contrastar con fondo negro)
    estados: {
      Normal: '#90A4AE',      // Gris más claro
      Franco: '#FFD700',      // El dorado brilla bien sobre negro
      Vacaciones: '#64B5F6',  // Azul más celeste
      Extra: '#FF8A65',       // Naranja salmón
    }
  },
};