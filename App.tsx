import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  FlatList, 
  useColorScheme, 
  View, 
  TouchableOpacity, 
  Modal // <--- Importamos Modal para la ventana emergente
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Iconos
import { Jornada } from './src/models/Jornada';
import { JornadaCard } from './src/components/JornadaCard';
import { Colores } from './src/constants/Colors'; // Tu paleta de colores

export default function App() {
  
  // --- 1. CONFIGURACIÓN VISUAL ---
  const colorScheme = useColorScheme();
  const esOscuro = colorScheme === 'dark';
  // Obtenemos los colores actuales según el tema
  const colores = esOscuro ? Colores.dark : Colores.light;

  // --- 2. ESTADOS (Memoria de la app) ---
  // Controla si la ventana de "Agregar" está visible o no
  const [modalVisible, setModalVisible] = useState(false);

  // Tus datos (por ahora fijos)
  const [jornadas, setJornadas] = useState<Jornada[]>([
    { id: '2025-01-01', fecha: '01/01/2025', horasNormales: 8, horas50: 0, horas100: 0, tipo: 'Normal' },
    { id: '2025-01-02', fecha: '02/01/2025', horasNormales: 8, horas50: 2, horas100: 0, tipo: 'Extra', observaciones: 'Se quedó un rato más' },
    { id: '2025-01-03', fecha: '03/01/2025', horasNormales: 0, horas50: 0, horas100: 0, tipo: 'Franco' },
  ]);

  return (
    <SafeAreaProvider>
      <SafeAreaView 
        style={[styles.container, { backgroundColor: colores.background }]} 
        edges={['top', 'left', 'right']}
      >
        
        {/* TÍTULO */}
        <Text style={[styles.titulo, { color: colores.text }]}>JornadApp</Text>
        
        {/* LISTA DE JORNADAS */}
        <FlatList
          data={jornadas}
          renderItem={({ item }) => <JornadaCard item={item} />}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.lista}
        />

        {/* --- AQUÍ EMPIEZA LA MAGIA --- */}

        {/* 1. EL MODAL (La ventana oculta) */}
        <Modal
          animationType="slide" // Aparece deslizándose desde abajo
          transparent={true}    // Para ver el fondo oscurecido detrás
          visible={modalVisible} // Si es true se ve, si es false se oculta
          onRequestClose={() => setModalVisible(false)} // Para el botón "Atrás" de Android
        >
          {/* Fondo semitransparente oscuro */}
          <View style={styles.modalOverlay}>
            
            {/* La ventana blanca (o negra) en sí */}
            <View style={[styles.modalContent, { backgroundColor: colores.cardBackground }]}>
              
              <Text style={[styles.modalTitulo, { color: colores.text }]}>Nueva Jornada</Text>
              
              {/* ACÁ IREMOS AGREGANDO LOS INPUTS CUANDO VUELVAS */}
              <Text style={{color: colores.textSecondary, marginVertical: 20}}>
                (Aquí irá el formulario para cargar horas)
              </Text>

              {/* Botón para Cerrar (Provisorio) */}
              <TouchableOpacity 
                style={[styles.botonCerrar, { backgroundColor: colores.estados.extra }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.textoBoton}>Cancelar</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

        {/* 2. EL BOTÓN FLOTANTE (FAB) */}
        <TouchableOpacity 
          style={[styles.fab, { backgroundColor: colores.tint }]} 
          onPress={() => setModalVisible(true)}
        >
          {/* CAMBIO: Usamos colores.textOnPrimary en lugar de "#fff" */}
          <Ionicons name="add" size={30} color={colores.textOnPrimary} />
        </TouchableOpacity>
        
        <StatusBar style={esOscuro ? "light" : "dark"} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ESTILOS
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 100, // Espacio para que el botón no tape lo último
  },
  // Estilo del botón redondo (+)
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,         // Sombra Android
    shadowColor: '#000',  // Sombra iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Negro al 50% de opacidad
    justifyContent: 'center', // Centrado vertical
    alignItems: 'center',     // Centrado horizontal
  },
  modalContent: {
    width: '90%', // Ocupa el 90% del ancho de la pantalla
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    alignItems: 'center',
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  botonCerrar: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold',
  }
});