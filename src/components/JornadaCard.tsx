/**
 * src/components/JornadaCard.tsx
 * Componente de Presentación (Dumb Component).
 *
 * Responsabilidad:
 * Renderizar la información visual de una jornada individual.
 * Este componente no gestiona estado ni lógica de negocio, solo recibe datos
 * y emite eventos de interacción (onPress).
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Jornada, TipoJornada } from '../models/Jornada';
import { Colores } from '../constants/Colors';

/**
 * Props del componente JornadaCard.
 * @param item Objeto con los datos de la jornada a mostrar.
 * @param onPress Callback que se ejecuta al interactuar con la tarjeta (ej: para editar).
 */
interface JornadaCardProps {
  item: Jornada;
  onPress: () => void;
}

export const JornadaCard = ({ item, onPress }: JornadaCardProps) => {
  
  // Detección del tema del sistema (Claro/Oscuro) para aplicar la paleta correcta.
  const theme = useColorScheme();
  const esOscuro = theme === 'dark';
  const coloresActuales = esOscuro ? Colores.dark : Colores.light;

  /**
   * Obtiene el color hexadecimal asociado al tipo de jornada.
   * Utiliza un mapeo directo basado en que las claves de 'Colors.ts'
   * coinciden con los valores del tipo 'TipoJornada'.
   */
  const getColorPorTipo = (tipo: TipoJornada) => {
    // Acceso directo al diccionario de colores por clave.
    // Se utiliza casting para flexibilidad, asumiendo consistencia en Colors.ts.
    return (coloresActuales.estados as any)[tipo] || coloresActuales.estados.Normal;
  };

  // Pre-cálculo de estilos dinámicos
  const colorPrincipal = getColorPorTipo(item.tipo);

  return (
    <TouchableOpacity 
      onPress={onPress}
      activeOpacity={0.7} // Feedback visual nativo al tocar
      style={[
        styles.card, 
        { 
          backgroundColor: coloresActuales.cardBackground, 
          borderLeftColor: colorPrincipal, 
          borderLeftWidth: 6 
        }
      ]}
    >
      
      {/* Encabezado: Fecha y Etiqueta de Tipo */}
      <View style={[styles.filaEncabezado, { borderBottomColor: coloresActuales.separator }]}>
        <Text style={[styles.textoFecha, { color: coloresActuales.text }]}>
          {item.fecha}
        </Text>
        <Text style={[styles.textoTipo, { color: colorPrincipal }]}>
          {item.tipo}
        </Text>
      </View>
      
      {/* Cuerpo: Desglose de Horas */}
      <View style={styles.filaDetalle}>
        <Text style={[styles.label, { color: coloresActuales.textSecondary }]}>
            Normales: <Text style={[styles.valor, { color: coloresActuales.text }]}>
                 {/* Visualización condicional: Guion '-' si el valor es 0 */}
                 {item.horasNormales > 0 ? item.horasNormales : '-'}
               </Text>
        </Text>
        <Text style={[styles.label, { color: coloresActuales.textSecondary }]}>
            50%: <Text style={[styles.valor, { color: coloresActuales.text }]}>
                   {item.horas50 > 0 ? item.horas50 : '-'}
                 </Text>
        </Text>
        <Text style={[styles.label, { color: coloresActuales.textSecondary }]}>
            100%: <Text style={[styles.valor, { color: coloresActuales.text }]}>
                    {item.horas100 > 0 ? item.horas100 : '-'}
                  </Text>
        </Text>
      </View>

      {/* Pie: Observaciones (Renderizado opcional) */}
      {item.observaciones && (
        <Text style={[
            styles.observaciones, 
            { 
                backgroundColor: coloresActuales.noteBackground,
                color: coloresActuales.noteText
            }
        ]}>
            Nota: {item.observaciones}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// Estilos estáticos de estructura y layout
const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    // Configuración de sombras (Elevation para Android, Shadow para iOS)
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', 
  },
  filaEncabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  textoFecha: {
    fontWeight: 'bold',
    fontSize: 17,
  },
  textoTipo: {
    fontWeight: '600',
    textTransform: 'uppercase',
    fontSize: 12,
    alignSelf: 'center',
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
  },
  valor: {
    fontWeight: 'bold',
  },
  observaciones: {
    marginTop: 10,
    fontStyle: 'italic',
    fontSize: 12,
    padding: 6,
    borderRadius: 4,
  }
});