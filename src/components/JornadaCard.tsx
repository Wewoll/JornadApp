import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Jornada, TipoJornada } from '../models/Jornada';
import { Colores } from '../constants/Colors';

interface JornadaCardProps {
  item: Jornada;
}

export const JornadaCard = ({ item }: JornadaCardProps) => {
  const theme = useColorScheme();
  const esOscuro = theme === 'dark';
  const coloresActuales = esOscuro ? Colores.dark : Colores.light;

  const getColorPorTipo = (tipo: TipoJornada) => {
    switch (tipo) {
      case 'Vacaciones': return coloresActuales.estados.vacaciones;
      case 'Franco': return coloresActuales.estados.franco;
      case 'Extra': return coloresActuales.estados.extra;
      case 'Normal':
      default: return coloresActuales.estados.normal;
    }
  };

  const getColorTextoPorTipo = (tipo: TipoJornada) => {
    if (tipo === 'Franco' && !esOscuro) {
        return coloresActuales.estados.textoFranco;
    }
    return getColorPorTipo(tipo);
  };

  const colorBorde = getColorPorTipo(item.tipo);
  const colorTexto = getColorTextoPorTipo(item.tipo);

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: coloresActuales.cardBackground, 
        borderLeftColor: colorBorde, 
        borderLeftWidth: 6 
      }
    ]}>
      
      <View style={[styles.filaEncabezado, { borderBottomColor: coloresActuales.separator }]}>
        <Text style={[styles.textoFecha, { color: coloresActuales.text }]}>
          {item.fecha}
        </Text>
        <Text style={[styles.textoTipo, { color: colorTexto }]}>
          {item.tipo}
        </Text>
      </View>
      
      <View style={styles.filaDetalle}>
        {/* Usamos textSecondary para las etiquetas "Normales:", etc. */}
        <Text style={[styles.label, { color: coloresActuales.textSecondary }]}>
            Normales: <Text style={[styles.valor, { color: coloresActuales.text }]}>
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

      {item.observaciones && (
        <Text style={[
            styles.observaciones, 
            { 
                // Aquí usamos los nuevos colores semánticos de Notas
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

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
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
    padding: 6, // Le di un poquito más de aire
    borderRadius: 4,
  }
});