/**
 * App.tsx
 * Punto de entrada principal de la aplicación JornadApp.
 * Orquesta la gestión de estado (CRUD), persistencia visual y navegación básica.
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
  Alert
} from 'react-native';

import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as NavigationBar from 'expo-navigation-bar';

import { Jornada } from './src/models/Jornada';
import { JornadaCard } from './src/components/JornadaCard';
import { Colores } from './src/constants/Colors';
import { JornadaForm } from './src/components/JornadaForm';

/**
 * MainContent
 * Componente contenedor que consume el contexto de SafeArea.
 * Maneja la lógica de negocio y el estado global de la lista de jornadas.
 */
function MainContent() {
  // --- CONFIGURACIÓN DE ENTORNO ---
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === 'dark';
  const colores = esOscuro ? Colores.dark : Colores.light;
  
  // --- ESTADO DE LA APLICACIÓN ---
  
  // Visibilidad del modal de carga/edición
  const [modalVisible, setModalVisible] = useState(false);

  // Jornada seleccionada para edición. 
  // null indica que se está creando una jornada nueva.
  const [jornadaSeleccionada, setJornadaSeleccionada] = useState<Jornada | null>(null);

  // Fuente de verdad de los datos (Lista de jornadas)
  const [jornadas, setJornadas] = useState<Jornada[]>([
    { id: '1', fecha: '01/01/2025', horasNormales: 8, horas50: 0, horas100: 0, tipo: 'Normal' },
  ]);

  // --- EFECTOS SECUNDARIOS ---
  
  // Ajuste de la barra de navegación de Android para coincidir con el tema
  useEffect(() => {
    if (Platform.OS === 'android' && Platform.Version >= 26) {
      NavigationBar.setButtonStyleAsync(esOscuro ? "light" : "dark");
    }
  }, [esOscuro]);

  // --- LÓGICA DE NEGOCIO (CRUD) ---

  /**
   * Procesa el guardado de una jornada.
   * Determina automáticamente si es una creación (Create) o actualización (Update)
   * basándose en la existencia de 'jornadaSeleccionada'.
   * @param datosNuevos Objeto con los valores provenientes del formulario.
   */
  const guardarJornada = (datosNuevos: any) => {
    if (jornadaSeleccionada) {
      // UPDATE: Busamos el elemento por ID y actualizamos sus propiedades
      const listaActualizada = jornadas.map((j) => {
        if (j.id === jornadaSeleccionada.id) {
          return { ...j, ...datosNuevos };
        }
        return j;
      });
      setJornadas(listaActualizada);

    } else {
      // CREATE: Generamos ID temporal y agregamos al inicio de la lista
      const nuevaJornada: Jornada = {
        id: Date.now().toString(),
        ...datosNuevos
      };
      setJornadas([nuevaJornada, ...jornadas]);
    }
    
    cerrarModal();
  };

  /**
   * Elimina la jornada seleccionada de la lista tras confirmación.
   * DELETE operation.
   */
  const eliminarJornada = () => {
    if (!jornadaSeleccionada) return;

    Alert.alert(
      "Eliminar Jornada",
      "¿Estás seguro? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => {
            const listaFiltrada = jornadas.filter(j => j.id !== jornadaSeleccionada.id);
            setJornadas(listaFiltrada);
            cerrarModal();
          }
        }
      ]
    );
  };

  // --- GESTIÓN DE UI ---

  const abrirParaCrear = () => {
    setJornadaSeleccionada(null);
    setModalVisible(true);
  };

  const abrirParaEditar = (item: Jornada) => {
    setJornadaSeleccionada(item);
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
    setJornadaSeleccionada(null);
  };

  // --- RENDERIZADO ---
  return (
    <View style={[styles.container, { backgroundColor: colores.background }]}>
      
      <View style={{ paddingTop: insets.top }}>
        <Text style={[styles.titulo, { color: colores.text }]}>JornadApp</Text>
      </View>
      
      <FlatList
        data={jornadas}
        renderItem={({ item }) => (
          <JornadaCard 
            item={item} 
            onPress={() => abrirParaEditar(item)} 
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.lista, { paddingBottom: 100 + insets.bottom }]}
      />

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
              // Pasamos props opcionales para el modo edición
              jornadaInicial={jornadaSeleccionada}
              onEliminar={jornadaSeleccionada ? eliminarJornada : undefined}
            />

          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colores.tint, bottom: 30 + insets.bottom }]} 
        onPress={abrirParaCrear}
      >
        <Ionicons name="add" size={30} color={colores.textOnPrimary} />
      </TouchableOpacity>
      
      <StatusBar style={esOscuro ? "light" : "dark"} />
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}

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