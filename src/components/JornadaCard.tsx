/**
 * src/components/JornadaCard.tsx
 * Componente de Presentación (Dumb Component).
 * * Su única responsabilidad es RECIBIR datos y MOSTRARLOS bonitos.
 * No modifica datos, no llama a APIs, no tiene estado complejo.
 */

import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Jornada, TipoJornada } from '../models/Jornada';
import { Colores } from '../constants/Colors';

// DEFINICIÓN DE PROPS (El Contrato)
// Esto le dice al componente padre: "Si quieres usarme, dame un objeto 'item' de tipo Jornada"
interface JornadaCardProps {
  item: Jornada;
}

export const JornadaCard = ({ item }: JornadaCardProps) => {
  
  // 1. DETECCIÓN DE TEMA (Hooks)
  // Preguntamos al sistema operativo si estamos en modo oscuro
  const theme = useColorScheme();
  const esOscuro = theme === 'dark';
  // Cargamos la paleta correspondiente
  const coloresActuales = esOscuro ? Colores.dark : Colores.light;

  // 2. LÓGICA DE VISUALIZACIÓN (Helpers)
  // Estas funciones encapsulan la lógica de "qué color corresponde a qué tipo".
  // Es como tener funciones 'private' en una clase Java.
  
  const getColorPorTipo = (tipo: TipoJornada) => {
    switch (tipo) {
      case 'Vacaciones': return coloresActuales.estados.vacaciones;
      case 'Franco': return coloresActuales.estados.franco;
      case 'Extra': return coloresActuales.estados.extra;
      case 'Normal':
      default: return coloresActuales.estados.normal;
    }
  };

  // Lógica especial para que el texto 'Franco' se lea bien sobre fondo blanco
  const getColorTextoPorTipo = (tipo: TipoJornada) => {
    if (tipo === 'Franco' && !esOscuro) {
        return coloresActuales.estados.textoFranco;
    }
    return getColorPorTipo(tipo);
  };

  // Calculamos los colores antes de renderizar
  const colorBorde = getColorPorTipo(item.tipo);
  const colorTexto = getColorTextoPorTipo(item.tipo);

  // 3. RENDERIZADO (UI)
  return (
    <View style={[
      styles.card, 
      { 
        // Estilos dinámicos: Se mezclan con los estáticos (styles.card)
        backgroundColor: coloresActuales.cardBackground, 
        borderLeftColor: colorBorde, 
        borderLeftWidth: 6 
      }
    ]}>
      
      {/* CABECERA: Fecha y Tipo */}
      <View style={[styles.filaEncabezado, { borderBottomColor: coloresActuales.separator }]}>
        <Text style={[styles.textoFecha, { color: coloresActuales.text }]}>
          {item.fecha}
        </Text>
        <Text style={[styles.textoTipo, { color: colorTexto }]}>
          {item.tipo}
        </Text>
      </View>
      
      {/* CUERPO: Las Horas */}
      <View style={styles.filaDetalle}>
        <Text style={[styles.label, { color: coloresActuales.textSecondary }]}>
            Normales: <Text style={[styles.valor, { color: coloresActuales.text }]}>
                 {/* OPERADOR TERNARIO: Si es > 0 muestra el número, sino un guion */}
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

      {/* PIE: Observaciones (Renderizado Condicional) */}
      {/* Solo se dibuja este bloque si item.observaciones tiene texto (no es null ni vacío) */}
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
    </View>
  );
};

// 4. ESTILOS ESTÁTICOS (Layout)
// Todo lo que sea estructura y dimensiones va aquí para mejor rendimiento
const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    // Sombras
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