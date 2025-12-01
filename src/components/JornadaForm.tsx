/**
 * src/components/JornadaForm.tsx
 * Componente Interactivo (Smart Component) para la carga de datos.
 *
 * Responsabilidades:
 * 1. Gestionar el estado temporal del formulario (inputs del usuario).
 * 2. Validar tipos de datos básicos (convertir strings a numbers).
 * 3. Comunicar el resultado al componente padre mediante el patrón Callback.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Platform
} from 'react-native';
// Librería nativa para selección de fechas (Android/iOS)
import DateTimePicker from '@react-native-community/datetimepicker';

import { Colores } from '../constants/Colors';
import { TipoJornada, TIPOS_JORNADA } from '../models/Jornada';

// Definición del contrato de comunicación con el Padre
interface JornadaFormProps {
  onCerrar: () => void;            // Se llama para cancelar la operación
  onGuardar: (datos: any) => void; // Se llama al confirmar, pasando el objeto de datos
}

export const JornadaForm = ({ onCerrar, onGuardar }: JornadaFormProps) => {
  // --- CONFIGURACIÓN DE UI ---
  const esOscuro = useColorScheme() === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;

  // --- ESTADO LOCAL (Memoria del Formulario) ---
  const [tipoSeleccionado, setTipoSeleccionado] = useState<TipoJornada>('Normal');

  // Gestión de Fechas:
  // 'fecha' almacena el objeto Date real.
  // 'mostrarCalendario' controla la visibilidad del modal nativo del sistema.
  const [fecha, setFecha] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Inputs de texto (se manejan como string para facilitar la edición)
  const [horasN, setHorasN] = useState('');
  const [horas50, setHoras50] = useState('');
  const [horas100, setHoras100] = useState('');
  const [observacion, setObservacion] = useState('');

  // --- LÓGICA DE NEGOCIO INTERNA ---

  /**
   * Maneja el evento de cambio del selector de fecha nativo.
   * @param event Evento del sistema (contiene tipo de acción, ej: dismissed)
   * @param selectedDate La fecha que eligió el usuario (puede ser undefined si canceló)
   */
  const onChangeFecha = (event: any, selectedDate?: Date) => {
    // En Android, el picker debe ocultarse manualmente tras la selección
    setMostrarCalendario(false);

    if (selectedDate) {
      setFecha(selectedDate);
    }
  };

  /**
   * Empaqueta los datos y ejecuta el callback del padre.
   * Realiza conversiones de tipos y asignaciones por defecto.
   */
  const handleGuardar = () => {
    // DTO (Data Transfer Object) listo para enviar
    const datosParaEnviar = {
      tipo: tipoSeleccionado,
      // Conversión segura: String -> Number. Si falla (NaN), usa 0.
      horasNormales: Number(horasN) || 0,
      horas50: Number(horas50) || 0,
      horas100: Number(horas100) || 0,
      observaciones: observacion,
      // Guardamos la fecha formateada según la configuración regional del usuario (dd/mm/yyyy)
      fecha: fecha.toLocaleDateString()
    };

    onGuardar(datosParaEnviar);
  };

  // --- RENDERIZADO (JSX) ---
  return (
    <View style={styles.container}>

      {/* SECCIÓN 1: TIPO DE JORNADA */}
      <Text style={[styles.label, { color: colores.textSecondary }]}>Tipo de Jornada</Text>
      <View style={styles.rowTipos}>
        {/* Generación dinámica de botones basada en la constante del modelo */}
        {TIPOS_JORNADA.map((tipo) => {
          const isSelected = tipoSeleccionado === tipo;
          return (
            <TouchableOpacity
              key={tipo}
              onPress={() => setTipoSeleccionado(tipo)}
              style={[
                styles.botonTipo,
                {
                  // Feedback visual de selección
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

      {/* SECCIÓN 2: SELECTOR DE FECHA */}
      <Text style={[styles.label, { color: colores.textSecondary, marginTop: 10 }]}>Fecha</Text>

      <TouchableOpacity
        onPress={() => setMostrarCalendario(true)}
        style={[styles.botonFecha, { backgroundColor: colores.inputBackground }]}
      >
        {/* Mostramos la fecha actual seleccionada como texto */}
        <Text style={{ color: colores.text, fontSize: 16 }}>
          {fecha.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {/* Componente DateTimePicker (Invisible/Modal según la plataforma) */}
      {mostrarCalendario && (
        <DateTimePicker
          value={fecha}
          mode="date"
          display="default" // Android: Modal, iOS: Spinner/Inline
          onChange={onChangeFecha}
          maximumDate={new Date()} // Opcional: Evitar seleccionar fechas futuras
        />
      )}

      {/* SECCIÓN 3: INPUTS DE HORAS (Renderizado Condicional) */}
      {/* Solo mostramos estos campos si el tipo de jornada requiere cargar horas */}
      {(tipoSeleccionado === 'Normal' || tipoSeleccionado === 'Extra') && (
        <View style={[styles.rowHoras, { marginTop: 15 }]}>

          {/* Input: Horas Normales */}
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

          {/* Input: Horas 50% */}
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

          {/* Input: Horas 100% */}
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

      {/* SECCIÓN 4: OBSERVACIONES */}
      <Text style={[styles.label, { color: colores.textSecondary, marginTop: 15 }]}>Nota (Opcional)</Text>
      <TextInput
        style={[styles.inputArea, { color: colores.text, backgroundColor: colores.inputBackground }]}
        value={observacion}
        onChangeText={setObservacion}
        placeholder="Ej: Salí tarde por..."
        placeholderTextColor={colores.textSecondary}
        multiline // Permite múltiples líneas
        numberOfLines={3} // Altura inicial visual
      />

      {/* SECCIÓN 5: BOTONES DE ACCIÓN */}
      <View style={styles.rowBotones}>
        {/* Botón Cancelar (Bordeado) */}
        <TouchableOpacity
            style={[styles.botonAccion, { borderWidth: 1, borderColor: colores.estados.extra }]}
            onPress={onCerrar}
        >
            <Text style={{ color: colores.estados.extra, fontWeight: 'bold' }}>Cancelar</Text>
        </TouchableOpacity>

        {/* Botón Guardar (Relleno) */}
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

// ESTILOS ESTÁTICOS (Layout)
// Se definen fuera del componente para evitar recrearlos en cada render.
const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  subLabel: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  rowTipos: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que los botones bajen si no entran
    gap: 8,
    marginBottom: 5,
  },
  botonTipo: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  botonFecha: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 5,
  },
  rowHoras: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputContainer: {
    flex: 1, // Distribución equitativa del espacio
  },
  input: {
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  inputArea: {
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    height: 80,
    textAlignVertical: 'top', // Alineación superior para textarea
    marginBottom: 20,
  },
  rowBotones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  botonAccion: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  }
});