/**
 * App.tsx
 * Punto de entrada principal de la aplicación JornadApp.
 * Se encarga de orquestar la lista de jornadas, el modal de carga y la configuración visual.
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
  Platform 
} from 'react-native';

// Librerías de terceros y utilidades
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; 
import * as NavigationBar from 'expo-navigation-bar';

// Nuestros componentes y modelos (MVC)
import { Jornada } from './src/models/Jornada';
import { JornadaCard } from './src/components/JornadaCard';
import { Colores } from './src/constants/Colors';
import { JornadaForm } from './src/components/JornadaForm';

/**
 * MainContent
 * Contiene toda la lógica visual y de estado. 
 * Está separado del 'App' principal para poder consumir el contexto de SafeArea.
 */
function MainContent() {
  // --- 1. HOOKS Y CONFIGURACIÓN ---
  
  // 'insets' nos dice cuánto miden las barras del sistema (Notch, Isla dinámica, Barra Home)
  const insets = useSafeAreaInsets();
  
  // Detectamos si el usuario usa Modo Oscuro o Claro
  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === 'dark';
  // Cargamos la paleta de colores correspondiente
  const colores = esOscuro ? Colores.dark : Colores.light;
  
  // --- 2. ESTADOS (Memoria de la Pantalla) ---
  
  // Controla si la ventana emergente (Modal) se ve o no
  const [modalVisible, setModalVisible] = useState(false);

  // Lista de jornadas. Inicializamos con un dato de prueba.
  // En el futuro, esto vendrá de una base de datos o Google Sheets.
  const [jornadas, setJornadas] = useState<Jornada[]>([
    { id: '2025-01-01', fecha: '01/01/2025', horasNormales: 8, horas50: 0, horas100: 0, tipo: 'Normal' },
  ]);

  // --- 3. EFECTOS (Interacción con el Sistema Operativo) ---
  
  // Este bloque se ejecuta cuando cambia el modo (esOscuro)
  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configuramos la barra de navegación inferior de Android
      // Chequeo de seguridad: Solo Android 8.0 (API 26) o superior soporta cambiar iconos
      if (Platform.Version >= 26) {
        NavigationBar.setButtonStyleAsync(esOscuro ? "light" : "dark");
      }
    }
  }, [esOscuro]);

  // --- 4. FUNCIONES LÓGICAS ---

  /**
   * Recibe los datos del formulario, crea el objeto Jornada y actualiza la lista.
   * @param datosNuevos Objeto con la info que llenó el usuario
   */
  const agregarJornada = (datosNuevos: any) => {
    const nuevaJornada: Jornada = {
      id: Date.now().toString(), // Usamos la hora actual como ID único temporal
      fecha: datosNuevos.fecha,
      horasNormales: datosNuevos.horasNormales,
      horas50: datosNuevos.horas50,
      horas100: datosNuevos.horas100,
      tipo: datosNuevos.tipo,
      observaciones: datosNuevos.observaciones
    };

    // INMUTABILIDAD: No hacemos push. Creamos un array nuevo poniendo lo nuevo primero.
    setJornadas([nuevaJornada, ...jornadas]);
    
    // Cerramos el modal una vez guardado
    setModalVisible(false);
  };

  // --- 5. RENDERIZADO (UI) ---
  return (
    // Contenedor principal. Usa el color de fondo dinámico (Negro o Gris claro)
    <View style={[styles.container, { backgroundColor: colores.background }]}>
      
      {/* HEADER: Le damos padding arriba (insets.top) para que el texto no quede debajo de la hora/cámara */}
      <View style={{ paddingTop: insets.top }}>
        <Text style={[styles.titulo, { color: colores.text }]}>JornadApp</Text>
      </View>
      
      {/* LISTA: Componente optimizado para mostrar muchos elementos */}
      <FlatList
        data={jornadas}
        renderItem={({ item }) => <JornadaCard item={item} />}
        keyExtractor={item => item.id}
        // Le damos espacio abajo (paddingBottom) para que el último elemento no quede tapado por el botón (+)
        contentContainerStyle={[styles.lista, { paddingBottom: 100 + insets.bottom }]}
      />

      {/* MODAL: La ventana emergente para cargar datos */}
      <Modal
        animationType="slide"      // Aparece deslizándose desde abajo
        transparent={true}         // Permite ver el fondo oscurecido atrás
        visible={modalVisible}     // Estado que controla si se ve o no
        onRequestClose={() => setModalVisible(false)} // Qué pasa si aprietan "Atrás" en Android
        statusBarTranslucent={true} // Permite que el oscurecimiento cubra la barra de estado superior
      >
        {/* Fondo semitransparente */}
        <View style={styles.modalOverlay}>
          {/* Caja de contenido */}
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: colores.cardBackground,
              // En modo oscuro agregamos un borde gris para separar del fondo negro
              borderWidth: esOscuro ? 1 : 0,
              borderColor: esOscuro ? '#444' : 'transparent',
            }
          ]}>
            <Text style={[styles.modalTitulo, { color: colores.text }]}>Nueva Jornada</Text>
            
            {/* Componente del Formulario */}
            <JornadaForm 
              onCerrar={() => setModalVisible(false)} 
              onGuardar={agregarJornada}              
            />

          </View>
        </View>
      </Modal>

      {/* BOTÓN FLOTANTE (FAB) */}
      <TouchableOpacity 
        // Posición absoluta. 'bottom' se ajusta dinámicamente según la barra de gestos del celular
        style={[styles.fab, { backgroundColor: colores.tint, bottom: 30 + insets.bottom }]} 
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color={colores.textOnPrimary} />
      </TouchableOpacity>
      
      {/* Controla el color de la hora y batería (Blanco o Negro) */}
      <StatusBar style={esOscuro ? "light" : "dark"} />
    </View>
  );
}

/**
 * App (Entry Point)
 * Su única función es proveer el contexto de "SafeArea" a toda la aplicación.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <MainContent />
    </SafeAreaProvider>
  );
}

// Estilos estáticos (Layout y dimensiones que no cambian con el tema)
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
    // Sombras para darle profundidad
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