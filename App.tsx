/**
 * App.tsx
 * Punto de entrada principal de la aplicación JornadApp.
 * * Responsabilidades:
 * 1. Gestión del Estado Global de la aplicación (Lista de jornadas, UI de carga).
 * 2. Orquestación del flujo CRUD (Create, Read, Update, Delete) conectado al servicio API.
 * 3. Configuración de la interfaz nativa (SafeArea, StatusBar, NavigationBar).
 * 4. Renderizado de la lista principal y el modal de edición.
 */

import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  FlatList, 
  useColorScheme, 
  View, 
  TouchableOpacity, 
  Modal,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';

import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as NavigationBar from 'expo-navigation-bar';

import { Jornada } from './src/models/Jornada';
import { JornadaCard } from './src/components/JornadaCard';
import { Colores } from './src/constants/Colors';
import { JornadaForm } from './src/components/JornadaForm';
import { ApiService } from './src/services/ApiService';

/**
 * Componente interno que contiene la lógica de negocio y visual.
 * Se separa del componente App principal para poder consumir el contexto de SafeAreaProvider.
 */
function MainContent() {
  // --- CONFIGURACIÓN DE ENTORNO Y TEMA ---
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;
  
  // --- ESTADO DE LA APLICACIÓN ---
  
  // Controla la visibilidad del modal de formulario
  const [modalVisible, setModalVisible] = useState(false);
  
  // Almacena la jornada que se está editando actualmente. 
  // Si es null, indica que se está creando una nueva entrada.
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada | null>(null);
  
  // Fuente de verdad de los datos mostrados en la lista.
  const [jornadas, setJornadas] = useState<Jornada[]>([]); 
  
  // Indicador de actividad de red (Spinner)
  const [cargando, setCargando] = useState(false);

  // --- EFECTOS SECUNDARIOS (LIFECYCLE) ---
  
  // Sincroniza el estilo de la barra de navegación de Android con el tema de la app
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 26) {
      NavigationBar.setButtonStyleAsync(esOscuro ? "light" : "dark");
    }
  }, [esOscuro]);

  // Carga inicial de datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  /**
   * Obtiene la lista actualizada de jornadas desde el backend.
   * Gestiona el estado de carga para feedback visual.
   */
  const cargarDatos = async () => {
    setCargando(true);
    const datosNube = await ApiService.fetchJornadas();
    setJornadas(datosNube);
    setCargando(false);
  };

  // --- LÓGICA DE NEGOCIO (CRUD) ---

  /**
   * Procesa la solicitud de guardar (Crear o Actualizar) una jornada.
   * Realiza la operación en el backend y actualiza el estado local optimistamente si hay éxito.
   * * @param datosNuevos - Objeto parcial con los valores del formulario.
   */
  const guardarJornada = async (datosNuevos: any) => {
    // Cerramos el modal inmediatamente para mejorar la percepción de velocidad
    cerrarModal();
    setCargando(true);

    if (jornadaSeleccionada) {
      // CASO UPDATE: Existe una jornada seleccionada, actualizamos sus datos.
      const jornadaEditada = { ...jornadaSeleccionada, ...datosNuevos };
      
      const exito = await ApiService.sendAction('update', jornadaEditada);
      
      if (exito) {
        // Actualización local del estado (Inmutabilidad: map devuelve un nuevo array)
        setJornadas(prev => prev.map(j => j.id === jornadaSeleccionada.id ? jornadaEditada : j));
      } else {
        Alert.alert("Error de Sincronización", "No se pudo actualizar el registro en la nube.");
      }

    } else {
      // CASO CREATE: No hay selección, creamos un nuevo registro.
      const nuevaJornada: Jornada = {
        id: Date.now().toString(), // ID temporal basado en timestamp
        ...datosNuevos
      };

      const exito = await ApiService.sendAction('create', nuevaJornada);

      if (exito) {
        // Inserción local al inicio de la lista
        setJornadas(prev => [nuevaJornada, ...prev]);
      } else {
        Alert.alert("Error de Sincronización", "No se pudo guardar el registro en la nube.");
      }
    }
    setCargando(false);
  };

  /**
   * Elimina la jornada seleccionada tras confirmación del usuario.
   * Ejecuta la eliminación en el backend y actualiza la lista local.
   */
  const eliminarJornada = () => {
    if (!jornadaSeleccionada) return;

    Alert.alert(
      "Eliminar Jornada",
      "¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            cerrarModal();
            setCargando(true);

            const exito = await ApiService.sendAction('delete', jornadaSeleccionada);

            if (exito) {
              // Eliminación local (Filter devuelve un nuevo array sin el elemento)
              setJornadas(prev => prev.filter(j => j.id !== jornadaSeleccionada.id));
            } else {
              Alert.alert("Error", "No se pudo eliminar el registro de la nube.");
            }
            setCargando(false);
          }
        }
      ]
    );
  };

  // --- GESTIÓN DE INTERFAZ DE USUARIO ---

  const abrirParaCrear = () => {
    setJornadaSeleccionada(null); // Limpiar selección indica "Modo Creación"
    setModalVisible(true);
  };

  const abrirParaEditar = (item: Jornada) => {
    setJornadaSeleccionada(item); // Establecer selección indica "Modo Edición"
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setJornadaSeleccionada(null); // Resetear selección por seguridad
  };

  // --- RENDERIZADO ---
  return (
    <View style={[styles.container, { backgroundColor: colores.background }]}>
      
      {/* Encabezado con ajuste de Safe Area superior */}
      <View style={{ paddingTop: insets.top }}>
        <Text style={[styles.titulo, { color: colores.text }]}>JornadApp</Text>
      </View>
      
      {/* Renderizado Condicional:
        Muestra Spinner de carga si está cargando y no hay datos.
        Muestra la Lista si ya hay datos cargados.
      */}
      {cargando && jornadas.length === 0 ? (
        <View style={styles.centro}>
          <ActivityIndicator size="large" color={colores.tint} />
          <Text style={{ color: colores.textSecondary, marginTop: 10 }}>Sincronizando...</Text>
        </View>
      ) : (
        <FlatList
          data={jornadas}
          renderItem={({ item }) => (
            <JornadaCard item={item} onPress={() => abrirParaEditar(item)} />
          )}
          keyExtractor={item => item.id}
          // Padding inferior para evitar que el FAB cubra el último elemento
          contentContainerStyle={[styles.lista, { paddingBottom: 100 + insets.bottom }]}
          // Pull-to-refresh nativo
          refreshing={cargando}
          onRefresh={cargarDatos}
        />
      )}

      {/* Modal de Formulario (Edición / Creación) */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cerrarModal}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: colores.cardBackground,
              borderWidth: esOscuro ? 1 : 0,
              borderColor: esOscuro ? '#444' : 'transparent',
            }
          ]}>
            <Text style={[styles.modalTitulo, { color: colores.text }]}>
              {jornadaSeleccionada ? 'Editar Jornada' : 'Nueva Jornada'}
            </Text>
            
            <JornadaForm 
              onCerrar={cerrarModal} 
              onGuardar={guardarJornada}
              jornadaInicial={jornadaSeleccionada}
              onEliminar={jornadaSeleccionada ? eliminarJornada : undefined}
            />

          </View>
        </View>
      </Modal>

      {/* Botón de Acción Flotante (FAB) para agregar */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colores.tint, bottom: 30 + insets.bottom }]} 
        onPress={abrirParaCrear}
      >
        <Ionicons name="add" size={30} color={colores.textOnPrimary} />
      </TouchableOpacity>
      
      {/* Control de barra de estado del sistema */}
      <StatusBar style={esOscuro ? "light" : "dark"} />
    </View>
  );
}

/**
 * Componente Raíz.
 * Provee el contexto de SafeArea para manejar notches e islas dinámicas.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}

// Estilos estáticos de layout y estructura
const styles = StyleSheet.create({
  container: { flex: 1 },
  titulo: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 20, 
    marginTop: 10 
  },
  lista: { paddingHorizontal: 16 },
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute', 
    right: 20, 
    width: 60, 
    height: 60, 
    borderRadius: 30,
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3,
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modalContent: { 
    width: '90%', 
    padding: 20, 
    borderRadius: 15, 
    elevation: 5, 
    alignItems: 'center' 
  },
  modalTitulo: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 10 
  },
});