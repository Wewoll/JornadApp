/**
 * src/components/JornadaForm.tsx
 * Componente Interactivo (Smart Component) para carga y edición.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons'; // Para el icono de borrar

import { Colores } from '../constants/Colors';
import { TipoJornada, TIPOS_JORNADA, Jornada } from '../models/Jornada';

// CONTRATO ACTUALIZADO:
// Ahora aceptamos datos opcionales para el modo Edición.
interface JornadaFormProps {
  onCerrar: () => void;
  onGuardar: (datos: any) => void;
  jornadaInicial?: Jornada | null; // Opcional: Solo viene si editamos
  onEliminar?: () => void;         // Opcional: Solo viene si editamos
}

export const JornadaForm = ({ onCerrar, onGuardar, jornadaInicial, onEliminar }: JornadaFormProps) => {
  const esOscuro = useColorScheme() === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;

  // --- ESTADOS LOCALES ---
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoJornada>('Normal');
  const [fecha, setFecha] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Inputs como string
  const [horasN, setHorasN] = useState('');
  const [horas50, setHoras50] = useState('');
  const [horas100, setHoras100] = useState('');
  const [observacion, setObservacion] = useState('');

  // --- EFECTO: AUTOLLENADO (La magia de la edición) ---
  // Este bloque se ejecuta cada vez que cambia 'jornadaInicial'.
  useEffect(() => {
    if (jornadaInicial) {
      // MODO EDICIÓN: Rellenamos los campos con los datos que vienen
      setTipoSeleccionado(jornadaInicial.tipo);
      setHorasN(String(jornadaInicial.horasNormales || ''));
      setHoras50(String(jornadaInicial.horas50 || ''));
      setHoras100(String(jornadaInicial.horas100 || ''));
      setObservacion(jornadaInicial.observaciones || '');

      // Parsear fecha: Convertir "DD/MM/YYYY" de vuelta a objeto Date
      // Asumimos formato local (día/mes/año)
      try {
        const partes = jornadaInicial.fecha.split('/'); 
        if (partes.length === 3) {
          // Date(año, mes - 1, dia) -> Los meses en JS van de 0 a 11
          const fechaObj = new Date(Number(partes[2]), Number(partes[1]) - 1, Number(partes[0]));
          setFecha(fechaObj);
        }
      } catch (e) {
        console.log("Error parseando fecha", e);
      }

    } else {
      // MODO CREACIÓN: Reseteamos todo a cero/hoy
      setTipoSeleccionado('Normal');
      setFecha(new Date());
      setHorasN('');
      setHoras50('');
      setHoras100('');
      setObservacion('');
    }
  }, [jornadaInicial]);


  const onChangeFecha = (event: any, selectedDate?: Date) => {
    setMostrarCalendario(false);
    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  const handleGuardar = () => {
    const datosParaEnviar = {
      tipo: tipoSeleccionado,
      horasNormales: Number(horasN) || 0,
      horas50: Number(horas50) || 0,
      horas100: Number(horas100) || 0,
      observaciones: observacion,
      fecha: fecha.toLocaleDateString()
    };
    onGuardar(datosParaEnviar);
  };

  return (
    <View style={styles.container}>

      {/* 1. TIPO DE JORNADA */}
      <Text style={[styles.label, { color: colores.textSecondary }]}>Tipo de Jornada</Text>
      <View style={styles.rowTipos}>
        {TIPOS_JORNADA.map((tipo) => {
          const isSelected = tipoSeleccionado === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              onPress={() => setTipoSeleccionado(tipo)}
              style={[
                styles.botonTipo,
                { backgroundColor: isSelected ? colores.tint : colores.buttonUnselected }
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

      {/* 2. FECHA */}
      <Text style={[styles.label, { color: colores.textSecondary, marginTop: 10 }]}>Fecha</Text>
      <TouchableOpacity
        onPress={() => setMostrarCalendario(true)}
        style={[styles.botonFecha, { backgroundColor: colores.inputBackground }]}
      >
        <Text style={{ color: colores.text, fontSize: 16 }}>
          {fecha.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {mostrarCalendario && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default"
          onChange={onChangeFecha}
        />
      )}

      {/* 3. INPUTS DE HORAS */}
      {(tipoSeleccionado === 'Normal' || tipoSeleccionado === 'Extra') && (
        <View style={[styles.rowHoras, { marginTop: 15 }]}>
          <View style={styles.inputContainer}>
            <Text style={[styles.subLabel, { color: colores.textSecondary }]}>Normales</Text>
            <TextInput
              style={[styles.input, { color: colores.text, backgroundColor: colores.inputBackground }]}
              keyboardType="numeric"
              value={horasN}
              onChangeText={setHorasN}
              placeholder="0"
              placeholderTextColor={colores.textSecondary}
            />
          </View>
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

      {/* 4. OBSERVACIONES */}
      <Text style={[styles.label, { color: colores.textSecondary, marginTop: 15 }]}>Nota (Opcional)</Text>
      <TextInput
        style={[styles.inputArea, { color: colores.text, backgroundColor: colores.inputBackground }]}
        value={observacion}
        onChangeText={setObservacion}
        placeholder="Ej: Salí tarde por..."
        placeholderTextColor={colores.textSecondary}
        multiline
        numberOfLines={3}
      />

      {/* 5. BOTONES DE ACCIÓN */}
      <View style={styles.rowBotones}>
        
        {/* BOTÓN ELIMINAR (Solo aparece si onEliminar existe) */}
        {onEliminar && (
          <TouchableOpacity
            style={[styles.botonIcono, { backgroundColor: '#ffebee' }]} // Un rojito muy suave de fondo
            onPress={onEliminar}
          >
            <Ionicons name="trash-outline" size={24} color={colores.danger} />
          </TouchableOpacity>
        )}

        {/* BOTÓN CANCELAR */}
        <TouchableOpacity
            style={[styles.botonAccion, { borderWidth: 1, borderColor: colores.danger }]}
            onPress={onCerrar}
        >
            <Text style={{ color: colores.danger, fontWeight: 'bold' }}>Cancelar</Text>
        </TouchableOpacity>

        {/* BOTÓN GUARDAR */}
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

const styles = StyleSheet.create({
  container: { width: '100%' },
  label: { fontSize: 14, marginBottom: 8, fontWeight: 'bold' },
  subLabel: { fontSize: 12, marginBottom: 4, textAlign: 'center' },
  rowTipos: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 5 },
  botonTipo: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  botonFecha: { padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 5 },
  rowHoras: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  inputContainer: { flex: 1 },
  input: { borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  inputArea: { borderRadius: 8, padding: 10, fontSize: 16, height: 80, textAlignVertical: 'top', marginBottom: 20 },
  
  rowBotones: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 }, // Gap reducido para que entren 3
  botonAccion: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  
  // Nuevo estilo para el botón cuadrado del tacho de basura
  botonIcono: { 
    width: 48, 
    borderRadius: 8, 
    alignItems: 'center', 
    justifyContent: 'center',
    borderColor: '#ffcdd2',
    borderWidth: 1
  }
});