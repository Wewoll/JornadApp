/**
 * src/components/JornadaForm.tsx
 * Componente Interactivo (Smart/Stateful Component).
 * * Maneja la entrada de datos del usuario.
 * Tiene su propio estado interno temporal (lo que escribes en los inputs)
 * y cuando termina, se lo pasa al Padre mediante eventos.
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  useColorScheme 
} from 'react-native';
import { Colores } from '../constants/Colors';
import { TipoJornada } from '../models/Jornada';

// PROPS: Definimos las "Callback Functions"
// En C, esto sería pasar punteros a funciones: void (*onGuardar)(Datos)
interface JornadaFormProps {
  onCerrar: () => void;            // Función para cancelar
  onGuardar: (datos: any) => void; // Función para enviar los datos al padre
}

export const JornadaForm = ({ onCerrar, onGuardar }: JornadaFormProps) => {
  // Configuración de tema
  const esOscuro = useColorScheme() === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;

  // --- ESTADO LOCAL (Memoria temporal del formulario) ---
  // Estas variables nacen cuando abres el modal y mueren cuando lo cierras.
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoJornada>('Normal');
  const [horasN, setHorasN] = useState('');    // Usamos string para los inputs de texto
  const [horas50, setHoras50] = useState('');
  const [horas100, setHoras100] = useState('');
  const [observacion, setObservacion] = useState('');

  // Array constante para generar los botones de tipo
  const tipos: TipoJornada[] = ['Normal', 'Extra', 'Franco', 'Vacaciones'];

  // --- MANEJADORES DE EVENTOS ---

  // Se ejecuta cuando el usuario toca "Guardar"
  const handleGuardar = () => {
    // Empaquetamos los datos (DTO - Data Transfer Object)
    const datosParaEnviar = {
      tipo: tipoSeleccionado,
      // Convertimos el texto a número. Si está vacío o es inválido, usamos 0.
      horasNormales: Number(horasN) || 0,
      horas50: Number(horas50) || 0,
      horas100: Number(horas100) || 0,
      observaciones: observacion,
      // Por ahora hardcodeamos la fecha (esto lo cambiaremos en el próximo paso)
      fecha: new Date().toLocaleDateString() 
    };

    // Ejecutamos la función del padre pasándole el paquete
    onGuardar(datosParaEnviar);
  };

  return (
    <View style={styles.container}>
      
      {/* 1. SELECCIONAR TIPO (Chips) */}
      <Text style={[styles.label, { color: colores.textSecondary }]}>Tipo de Jornada</Text>
      <View style={styles.rowTipos}>
        {/* Mapeamos el array de tipos para crear botones dinámicamente */}
        {tipos.map((tipo) => {
          const isSelected = tipoSeleccionado === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              onPress={() => setTipoSeleccionado(tipo)}
              style={[
                styles.botonTipo,
                { 
                  // Cambio de color según estado (Seleccionado vs Desactivado)
                  backgroundColor: isSelected ? colores.tint : colores.buttonUnselected,
                }
              ]}
            >
              <Text style={{ 
                color: isSelected ? colores.textOnPrimary : colores.textUnselected,
                fontWeight: 'bold'
              }}>
                {tipo}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 2. INPUTS DE HORAS */}
      {/* RENDERIZADO CONDICIONAL: Solo mostramos inputs si tiene sentido para el tipo de día */}
      {(tipoSeleccionado === 'Normal' || tipoSeleccionado === 'Extra') && (
        <View style={styles.rowHoras}>
          {/* Input Normales */}
          <View style={styles.inputContainer}>
            <Text style={[styles.subLabel, { color: colores.textSecondary }]}>Normales</Text>
            <TextInput 
              style={[styles.input, { color: colores.text, backgroundColor: colores.inputBackground }]}
              keyboardType="numeric" // Teclado numérico
              value={horasN}
              onChangeText={setHorasN} // Actualiza el estado automáticamente al escribir
              placeholder="0"
              placeholderTextColor={colores.textSecondary}
            />
          </View>
          
          {/* Input 50% */}
          <View style={styles.inputContainer}>
            <Text style={[styles.subLabel, { color: colores.textSecondary }]}>Al 50%</Text>
            <TextInput 
              style={[styles.input, { color: colores.text, backgroundColor: colores.inputBackground }]}
              keyboardType="numeric"
              value={horas50}
              onChangeText={setHoras50}
              placeholder="0"
              placeholderTextColor={colores.textSecondary}
            />
          </View>

          {/* Input 100% */}
          <View style={styles.inputContainer}>
            <Text style={[styles.subLabel, { color: colores.textSecondary }]}>Al 100%</Text>
            <TextInput 
              style={[styles.input, { color: colores.text, backgroundColor: colores.inputBackground }]}
              keyboardType="numeric"
              value={horas100}
              onChangeText={setHoras100}
              placeholder="0"
              placeholderTextColor={colores.textSecondary}
            />
          </View>
        </View>
      )}

      {/* 3. OBSERVACIONES */}
      <Text style={[styles.label, { color: colores.textSecondary, marginTop: 15 }]}>Nota (Opcional)</Text>
      <TextInput 
        style={[styles.inputArea, { color: colores.text, backgroundColor: colores.inputBackground }]}
        value={observacion}
        onChangeText={setObservacion}
        placeholder="Ej: Salí tarde por..."
        placeholderTextColor={colores.textSecondary}
        multiline // Permite escribir en varios renglones
      />

      {/* 4. BOTONES DE ACCIÓN (Cancelar / Guardar) */}
      <View style={styles.rowBotones}>
        <TouchableOpacity 
            style={[styles.botonAccion, { borderWidth: 1, borderColor: colores.estados.extra }]}
            onPress={onCerrar}
        >
            <Text style={{ color: colores.estados.extra, fontWeight: 'bold' }}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={[styles.botonAccion, { backgroundColor: colores.tint }]}
            onPress={handleGuardar}
        >
            <Text style={{ color: colores.textOnPrimary, fontWeight: 'bold' }}>Guardar</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

// ESTILOS DE LAYOUT (Estructura fija)
const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  subLabel: { fontSize: 12, marginBottom: 4, textAlign: 'center' },
  rowTipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 15 },
  botonTipo: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  rowHoras: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  inputContainer: { flex: 1 },
  input: { borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  inputArea: { borderRadius: 8, padding: 10, fontSize: 16, height: 80, textAlignVertical: 'top', marginBottom: 20 },
  rowBotones: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  botonAccion: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center' }
});